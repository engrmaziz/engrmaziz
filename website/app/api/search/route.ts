/* eslint-disable */
// @ts-nocheck
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { validateRequest } from '@/lib/security/validation';
import { searchSchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { ragEmbedder } from '@/lib/rag/embedder';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    await checkRateLimit(ip, 'search', 100, 60000);

    const data = await validateRequest(searchSchema, req);

    // Hybrid search stub
    const vector = await ragEmbedder.embed(data.query);
    
    // Hit vector DB...
    const results: any[] = [];

    return successResponse({ results, total: 0 });
  } catch (error) {
    return errorResponse(error);
  }
}
