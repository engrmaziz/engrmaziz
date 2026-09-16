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
    name: z.string().min(2).max(80),
    email: z.string().email().max(120),
  }).optional(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(1600),
  })).max(16).optional(),
});

export const runtime = 'nodejs';

let isInitialized = false;

export async function POST(req: NextRequest) {
  const requestStart = Date.now();
  try {
    if (!isInitialized) {
      validateStartup();
      isInitialized = true;
    }

    const ip = getClientIp(req);
    await checkRateLimit(ip, 'chat', 20, 60000); // 20 requests per minute

    const data = await validateRequest(chatRequestSchema, req);
    const { containsPromptInjection, sanitizeClientMessages, sanitizeVisitor } = await import('@/lib/security/input');

    if (!data.visitorInfo) {
      return successResponse({
        content: "Hello, I'm RAGX. May I know your name and email before we begin?",
        requiresIdentity: true
      });
    }

    const visitorInfo = sanitizeVisitor(data.visitorInfo);
    if (containsPromptInjection(data.message) || containsPromptInjection(visitorInfo.name)) {
      return successResponse({
        content: "I can help with Musharraf's services, projects, and hiring. Ask about call agents, RAG, or booking a discovery call.",
        citations: [],
        modelUsed: 'guard',
        ttftMs: Date.now() - requestStart,
        tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      });
    }

    const { conversationService } = await import('@/lib/db/services');
    await conversationService.assertVisitorOwnsConversation(data.conversationId, visitorInfo);

    if (data.message.toLowerCase().includes('hire') || data.message.toLowerCase().includes('meet')) {
      const { leadScoring } = await import('@/lib/services/LeadScoringService');
      const { emailService } = await import('@/lib/email/resend');
      const score = leadScoring.calculateScore({ email: visitorInfo.email, projectDescription: data.message });
      if (score > 50) {
        emailService.sendContactNotification({ ...visitorInfo, message: data.message, projectType: 'RAGX Lead' }).catch(console.error);
      }
    }

    const priorTurns = sanitizeClientMessages(data.messages);
    const hasThread = priorTurns.length > 0;

    // 2. Lightweight Intent Router
    const msgLower = data.message.toLowerCase().trim();
    const isGreeting = /^(hello|hi|hey|greetings|how are you|good morning|good afternoon|what's up)\b/.test(msgLower) && msgLower.length < 40;
    const isResume = /\b((download|get|send|share).{0,24}\b(resume|cv)|(resume|cv).{0,16}\b(download|pdf|file|link))\b/i.test(msgLower) && msgLower.length < 80;
    const isContact = /\b(contact|email|reach out|get in touch)\b/.test(msgLower) && msgLower.length < 50 && !/\b(book|meeting|discovery|schedule|available)\b/.test(msgLower);

    let intentResponse: string | null = null;
    
    if (isResume) {
      intentResponse = "Download the current resume as [Musharraf_Aziz_CV.pdf](/Musharraf_Aziz_CV.pdf).";
    } else if (isContact && !hasThread) {
      intentResponse = "You can reach Musharraf directly at io@maziz.me, or use the [Contact Form](/contact) for project inquiries.";
    } else if (isGreeting && !hasThread) {
      intentResponse = "Hello! I'm RAGX, Musharraf's AI Knowledge Assistant. Ask me anything about his services, projects, or expertise — or let me know if you'd like to book a meeting.";
    }

    if (intentResponse) {
      const { ragMemory } = await import('@/lib/rag/memory');
      const { recordTtft } = await import('@/lib/rag/metrics');
      const ttftMs = Date.now() - requestStart;
      recordTtft(ttftMs);
      await ragMemory.saveUserMessage(data.conversationId, data.message).catch(console.error);
      await ragMemory.saveAssistantMessage(data.conversationId, intentResponse).catch(console.error);
      
      return successResponse({
        content: intentResponse,
        citations: [],
        modelUsed: 'intent-router',
        ttftMs,
        tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      });
    }

    // 3. Production Orchestrator Execution (for Knowledge intent)
    const { ragOrchestrator } = await import('@/lib/rag/orchestrator');
    const response = await ragOrchestrator.execute({
      query: data.message,
      sessionId: data.conversationId,
      filters: {},
      visitorInfo,
      messages: priorTurns,
    });

    if (response.answer && /meeting request has been sent/i.test(response.answer)) {
      const { emailService } = await import('@/lib/email/resend');
      const { formatBookingEmail, slotsFromSession } = await import('@/lib/rag/session-memory');
      const slots = slotsFromSession(priorTurns, data.message, visitorInfo);
      emailService.sendContactNotification({
        name: visitorInfo.name,
        email: visitorInfo.email,
        projectType: 'Booking Request',
        message: formatBookingEmail(slots, priorTurns, data.message)
      }).catch(console.error);
    }

    return successResponse({
      content: response.answer,
      citations: response.citations,
      modelUsed: response.context?.executionContext?.metadata?.agentContext?.lastLlmModel || 'unknown',
      ttftMs: response.ttftMs ?? response.latencyMs ?? 0,
      tokenUsage: {
        promptTokens: response.context?.executionContext?.diagnostics?.promptTokens || 0,
        completionTokens: response.context?.executionContext?.diagnostics?.completionTokens || 0,
        totalTokens: response.context?.executionContext?.diagnostics?.totalTokens || 0
      }
    });
  } catch (error: any) {
    console.error('CHAT API ERROR [RAW]:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
    });

    if (error instanceof AppError) {
      if (error.statusCode >= 500) {
        return errorResponse(new AppError('An unexpected error occurred.', 500, 'INTERNAL_ERROR'));
      }
      return errorResponse(error);
    }

    return errorResponse(new AppError('An unexpected error occurred.', 500, 'INTERNAL_ERROR'));
  }
}
