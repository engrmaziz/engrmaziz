import { NextResponse } from 'next/server';
import { getSystemVersion } from '@/lib/system';

export async function GET() {
  const version = getSystemVersion();
  return NextResponse.json(version, { status: 200 });
}
