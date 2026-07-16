/* eslint-disable */
import { NextResponse } from 'next/server';
import { ragIndexer } from '@/lib/rag/indexer';
import { telemetryLogger } from '@/lib/telemetry';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    telemetryLogger.log('RAG', 'Ingestion crawl request triggered.');
    const result = await ragIndexer.indexAll();
    
    return NextResponse.json({
      message: 'Ingestion pipeline execution complete.',
      ...result
    });
  } catch (error: any) {
    console.error('[RAG Index API] Ingestion failed:', error);
    return NextResponse.json({
      error: error.message || String(error)
    }, { status: 500 });
  }
}
