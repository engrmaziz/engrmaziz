/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { pgPool } from '@/lib/rag/supabase';
import { getLastTtft, probeTtft } from '@/lib/rag/metrics';
import { localKnowledgeIndex } from '@/lib/rag/local-index';
import { getLastVoiceTelemetry } from '@/lib/voice/metrics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const start = Date.now();
    await pgPool.query('SELECT 1');
    const latency = Date.now() - start;
    const kb = localKnowledgeIndex.size();

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
    const voice = getLastVoiceTelemetry();

    return NextResponse.json({
      status: 'ONLINE',
      latency,
      ttft,
      embeddingModel: 'jina-embeddings-v4',
      documents: kb.documents,
      chunks: kb.chunks,
      lastSync: new Date().toISOString(),
      health: 'EXCELLENT',
      voice: voice
        ? {
            ttfaMs: voice.ttfaMs,
            sttMs: voice.sttMs,
            ragMs: voice.ragMs,
            ttsMs: voice.ttsMs,
            totalMs: voice.totalMs,
            voice: voice.voice,
            updatedAt: voice.updatedAt,
          }
        : null,
    });
  } catch (error: any) {
    console.error('RAG Status API route error:', error);
    return NextResponse.json({
      status: 'OFFLINE',
      latency: 0,
      ttft: 0,
      documents: 0,
      chunks: 0,
      lastSync: null,
      health: 'CRITICAL',
      voice: getLastVoiceTelemetry(),
    }, { status: 503 });
  }
}
