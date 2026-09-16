/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { pgPool } from '@/lib/rag/supabase';
import { systemConfig } from '@/lib/system/config';
import { getLastTtft, probeTtft } from '@/lib/rag/metrics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const start = Date.now();
    await pgPool.query('SELECT 1');
    const latency = Date.now() - start;

    let lastChatTtft: number | null = null;
    try {
      const { rows } = await pgPool.query(
        'SELECT latency_ms FROM public.rag_logs ORDER BY created_at DESC LIMIT 1'
      );
      const value = Number(rows[0]?.latency_ms);
      if (Number.isFinite(value) && value >= 0) lastChatTtft = Math.round(value);
    } catch {
      lastChatTtft = null;
    }

    const ttft = getLastTtft() ?? lastChatTtft ?? probeTtft();

    return NextResponse.json({
      status: 'ONLINE',
      latency,
      ttft,
      embeddingModel: systemConfig.JINA_EMBEDDING_MODEL || 'jina-embeddings-v4',
      health: 'EXCELLENT',
    });
  } catch (error: any) {
    console.error('RAG Status API route error:', error);
    return NextResponse.json({
      status: 'OFFLINE',
      latency: 0,
      ttft: 0,
      embeddingModel: 'jina-embeddings-v4',
      health: 'CRITICAL',
      error: error.message || String(error),
    }, { status: 503 });
  }
}
