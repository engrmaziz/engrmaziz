/* eslint-disable */
import { NextResponse } from 'next/server';
import { ragRetriever } from '@/lib/rag/retriever';

export async function POST(req: Request) {
  const start = Date.now();
  try {
    const body = await req.json();
    const query = body.query || '';
    const limit = body.limit !== undefined ? parseInt(body.limit, 10) : 5;
    const threshold = body.threshold !== undefined ? parseFloat(body.threshold) : 0.3;
    const filters = body.filters || {};

    if (!query.trim()) {
      return NextResponse.json({ error: 'Query parameter cannot be empty.' }, { status: 400 });
    }

    const result = await ragRetriever.retrieve(query, limit, threshold, filters);
    const latencyMs = Date.now() - start;

    return NextResponse.json({
      ...result,
      latencyMs
    });
  } catch (error: any) {
    console.error('[RAG Search API] Error:', error);
    return NextResponse.json({
      error: error.message || String(error),
      latencyMs: Date.now() - start
    }, { status: 500 });
  }
}
