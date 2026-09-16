/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { ragOrchestrator } from '@/lib/rag/orchestrator';
import { validateStartup } from '@/lib/system/startup';

export async function POST(req: Request) {
  try {
    validateStartup();
    const body = await req.json();
    const result = await ragOrchestrator.execute(body);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[RAG API Route] Error:', error.message);
    return NextResponse.json(
      { error: error.message || String(error) }, 
      { status: 500 }
    );
  }
}
