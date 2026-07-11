import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { validateRequest } from '@/lib/security/validation';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { ragxService } from '@/lib/rag/RAGXService';
import { z } from 'zod';

const chatRequestSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1).max(2000),
  visitorInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }).optional(),
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
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

    const response = await ragxService.processMessage(data.conversationId, data.message, data.visitorInfo);

    return successResponse(response);
  } catch (error) {
    return errorResponse(error);
  }
}
