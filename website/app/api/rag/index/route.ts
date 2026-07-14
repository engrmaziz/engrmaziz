/* eslint-disable */
import { NextResponse } from 'next/server';
import { ragIndexer } from '@/lib/rag/indexer';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('[RAG Index API] Ingestion crawl request triggered.');
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
