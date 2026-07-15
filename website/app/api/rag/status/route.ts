/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { ragDatabase } from '@/lib/rag/supabase';
import { supabase } from '@/lib/db/supabase';
import { systemConfig } from '@/lib/system/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const start = Date.now();
    // Query direct health check
    const { error } = await supabase.from('documents').select('id').limit(1);
    const latency = Date.now() - start;

    if (error) {
      throw error;
    }

    const status = await ragDatabase.getDatabaseStatus();

    return NextResponse.json({
      status: 'ONLINE',
      latency,
      embeddingModel: systemConfig.JINA_EMBEDDING_MODEL || 'jina-embeddings-v4',
      documents: status.documents,
      chunks: status.chunks,
      lastSync: status.latestSync,
      health: 'EXCELLENT',
    });
  } catch (error: any) {
    console.error('RAG Status API route error:', error);
    return NextResponse.json({
      status: 'OFFLINE',
      latency: 0,
      embeddingModel: 'jina-embeddings-v4',
      documents: 0,
      chunks: 0,
      lastSync: null,
      health: 'CRITICAL',
      error: error.message || String(error),
    });
  }
}
