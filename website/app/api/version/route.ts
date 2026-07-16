import { NextResponse } from 'next/server';
import { getSystemVersion } from '@/lib/system/version';

export async function GET() {
  const version = getSystemVersion();
  return NextResponse.json(version, { status: 200 });
}
