import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { validateRequest } from '@/lib/security/validation';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { validateStartup } from '@/lib/system/startup';
import { AppError } from '@/lib/utils/errors';
import { z } from 'zod';

const chatRequestSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1).max(2000),
  visitorInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }).optional(),
});

export const runtime = 'nodejs';

let isInitialized = false;

export async function POST(req: NextRequest) {
  try {
    if (!isInitialized) {
      validateStartup();
      isInitialized = true;
    }

    const ip = getClientIp(req);
    await checkRateLimit(ip, 'chat', 20, 60000); // 20 requests per minute

    const data = await validateRequest(chatRequestSchema, req);

    // Identity Gate check
    if (!data.visitorInfo) {
      return successResponse({
        content: "Hello, I'm RAGX. May I know your name and email before we begin?",
        requiresIdentity: true
      });
    }

    // 1. Pre-computation hooks (Lead scoring & Persistence)
    if (data.visitorInfo) {
      const { conversationService } = await import('@/lib/db/services');
      const { leadScoring } = await import('@/lib/services/LeadScoringService');
      const { emailService } = await import('@/lib/email/resend');

      await conversationService.ensureConversationExists(data.conversationId, data.visitorInfo).catch(console.error);

      // Async lead qualification hook
      if (data.message.toLowerCase().includes('hire') || data.message.toLowerCase().includes('meet')) {
        const score = leadScoring.calculateScore({ email: data.visitorInfo.email, projectDescription: data.message });
        if (score > 50) {
          emailService.sendContactNotification({ ...data.visitorInfo, message: data.message, projectType: 'RAGX Lead' }).catch(console.error);
        }
      }
    }

    // 2. Production Orchestrator Execution
    const { ragOrchestrator } = await import('@/lib/rag/orchestrator');
    const response = await ragOrchestrator.execute({
      query: data.message,
      sessionId: data.conversationId,
      filters: {} // No active filters sent from UI yet
    });

    return successResponse({
      content: response.answer,
      citations: response.citations,
      modelUsed: response.context?.executionContext?.metadata?.agentContext?.lastLlmModel || 'unknown',
      tokenUsage: {
        promptTokens: response.context?.executionContext?.diagnostics?.promptTokens || 0,
        completionTokens: response.context?.executionContext?.diagnostics?.completionTokens || 0,
        totalTokens: response.context?.executionContext?.diagnostics?.totalTokens || 0
      },
      trace: response.context?.executionContext?.trace?.exportTrace()
    });
  } catch (error: any) {
    // 1. Capture complete exception before any formatting (Step 1)
    console.error('CHAT API ERROR [RAW]:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
      code: error?.code,
      details: error?.details,
      raw: error
    });

    // 2. Map standard exceptions into AppError instances (Step 3 & 5)
    let standardizedError = error;

    if (!(error instanceof AppError)) {
      if (error?.name === 'ProviderConfigurationError' || error?.name === 'ProviderExecutionError') {
        standardizedError = new AppError(error.message, 500, 'PROVIDER_ERROR');
      } else if (error?.code && typeof error.code === 'string' && error.code.match(/^[0-9A-Z]{5}$/)) {
        // Postgres/Supabase error codes are typically 5 characters
        standardizedError = new AppError('Database operation failed', 500, 'DATABASE_ERROR');
      } else {
        standardizedError = new AppError(error?.message || 'An unexpected error occurred.', 500, 'INTERNAL_ERROR');
      }
    }

    return errorResponse(standardizedError);
  }
}
