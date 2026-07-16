/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { pgPool } from '@/lib/rag/supabase';
import { systemConfig } from '@/lib/system/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const start = Date.now();
    // Ultra-lightweight direct connection check using raw pgPool instead of full Supabase JS client
    await pgPool.query('SELECT 1');
    const latency = Date.now() - start;

    return NextResponse.json({
      status: 'ONLINE',
      latency,
      embeddingModel: systemConfig.JINA_EMBEDDING_MODEL || 'jina-embeddings-v4',
      health: 'EXCELLENT',
    });
  } catch (error: any) {
    console.error('RAG Status API route error:', error);
    return NextResponse.json({
      status: 'OFFLINE',
      latency: 0,
      embeddingModel: 'jina-embeddings-v4',
      health: 'CRITICAL',
      error: error.message || String(error),
    }, { status: 503 });
  }
}
