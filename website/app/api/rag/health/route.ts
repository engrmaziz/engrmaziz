/* eslint-disable */
import { NextResponse } from 'next/server';
import { ragDatabase } from '@/lib/rag/supabase';
import { systemConfig } from '@/lib/system/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status: Record<string, any> = {
    database: 'OFFLINE',
    jina: 'OFFLINE',
    groq: 'OFFLINE',
    overall: 'UNHEALTHY',
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Database Connection check
    await ragDatabase.getDatabaseStatus();
    status.database = 'ONLINE';
  } catch (err: any) {
    console.error('[RAG Health] Database offline:', err.message || err);
  }

  // 2. Jina AI API verification
  if (systemConfig.JINA_API_KEY && systemConfig.JINA_API_KEY !== 'dummy' && systemConfig.JINA_API_KEY.length > 10) {
    status.jina = 'ONLINE';
  }

  // 3. Groq API validation
  if (systemConfig.GROQ_API_KEY && systemConfig.GROQ_API_KEY !== 'dummy' && systemConfig.GROQ_API_KEY.length > 10) {
    status.groq = 'ONLINE';
  }

  if (status.database === 'ONLINE' && status.jina === 'ONLINE' && status.groq === 'ONLINE') {
    status.overall = 'HEALTHY';
  }

  const responseStatus = status.overall === 'HEALTHY' ? 200 : 503;
  return NextResponse.json(status, { status: responseStatus });
}
