import { NextResponse } from 'next/server';
import { checkReadiness } from '@/lib/system';

export async function GET() {
  const readiness = checkReadiness();
  
  if (readiness.status !== 'ready') {
    return NextResponse.json(readiness, { status: 503 });
  }

  return NextResponse.json(readiness, { status: 200 });
}
