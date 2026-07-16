/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
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
  flags: z.record(z.any()).optional(),
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

    // 2. Lightweight Intent Router
    const msgLower = data.message.toLowerCase().trim();
    const isGreeting = /^(hello|hi|hey|greetings|how are you|good morning|good afternoon|what's up)\b/.test(msgLower) && msgLower.length < 40;
    const isResume = /\b(resume|cv|download cv)\b/.test(msgLower) && msgLower.length < 50;
    const isContact = /\b(contact|email|reach out|get in touch)\b/.test(msgLower) && msgLower.length < 50;

    let intentResponse: string | null = null;
    
    if (isResume) {
      intentResponse = "You can view or download Musharraf's resume here: [View Resume](/api/resume)";
    } else if (isContact) {
      intentResponse = "You can reach Musharraf directly at io@maziz.me, or use the [Contact Form](/contact) for project inquiries.";
    } else if (isGreeting) {
      intentResponse = "Hello! I'm RAGX, Musharraf's AI Knowledge Assistant. Ask me anything about his services, projects, or expertise — or let me know if you'd like to book a meeting.";
    }

    if (intentResponse) {
      const { ragMemory } = await import('@/lib/rag/memory');
      await ragMemory.saveUserMessage(data.conversationId, data.message).catch(console.error);
      await ragMemory.saveAssistantMessage(data.conversationId, intentResponse).catch(console.error);
      
      return successResponse({
        content: intentResponse,
        citations: [],
        modelUsed: 'intent-router',
        tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      });
    }

    // 3. Production Orchestrator Execution (for Knowledge intent)
    const { ragOrchestrator } = await import('@/lib/rag/orchestrator');
    const response = await ragOrchestrator.execute({
      query: data.message,
      sessionId: data.conversationId,
      filters: {}, // No active filters sent from UI yet
      flags: (data as any).flags,
      visitorInfo: data.visitorInfo
    });

    if (response.answer && response.answer.includes("Your meeting request has been sent")) {
      const { emailService } = await import('@/lib/email/resend');
      const { ragMemory } = await import('@/lib/rag/memory');
      const { providerFactory } = await import('@/lib/providers');
      
      const { messages } = await ragMemory.loadConversationAndUnsummarized(data.conversationId);
      const conversationLog = messages?.slice(-6).map((m: any) => `${m.role}: ${m.content}`).join('\n\n') || data.message;
      
      // Extract the requested date using a fast internal LLM call
      const aiClient = providerFactory.getChatProvider();
      const dateExtractRes = await aiClient.generate({
        prompt: `Extract the requested meeting date and time from the following conversation. Return ONLY a valid ISO 8601 datetime string (YYYY-MM-DDTHH:mm:ssZ). If no specific date/time is found, return "UNKNOWN".\n\nConversation:\n${conversationLog}`
      });
      
      const isoDate = dateExtractRes?.content?.trim() || 'UNKNOWN';
      const parsedDate = new Date(isoDate);
      
      // Deterministic Server-Side Validation
      if (isoDate === 'UNKNOWN' || isNaN(parsedDate.getTime()) || parsedDate.getTime() < Date.now()) {
        console.warn(`[Booking Validation] Invalid or past date detected: ${isoDate}`);
        response.answer = "I see you'd like to book a meeting, but the date and time provided seem to be invalid or in the past. Could you please specify a valid future date and time for the meeting?";
        
        // Prevent email dispatch and wipe the trigger from the LLM memory so it asks again
        const lastIndex = messages?.length ? messages.length - 1 : -1;
        if (lastIndex >= 0) {
          // We will save the corrected assistant response in the persistence phase automatically
        }
      } else {
        // Valid future date
        await emailService.sendContactNotification({
          name: data.visitorInfo?.name || 'Visitor',
          email: data.visitorInfo?.email || 'Unknown',
          projectType: 'Booking Request',
          message: `A meeting request was confirmed for ${parsedDate.toLocaleString()}.\n\nRecent Conversation:\n${conversationLog}\n\nUser Confirmation: ${data.message}`
        }).catch(console.error);
      }
    }

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
