import { NextResponse } from 'next/server';
import { checkHealth } from '@/lib/system';

export async function GET() {
  const health = checkHealth();
  
  if (health.status !== 'pass') {
    return NextResponse.json(health, { status: 503 });
  }

  return NextResponse.json(health, { status: 200 });
}
