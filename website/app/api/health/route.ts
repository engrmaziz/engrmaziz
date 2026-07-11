/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/utils/response';
import { FEATURES } from '@/lib/config/features';

export const runtime = 'edge';

export async function GET() {
  return successResponse({
    version: '1.0.0-rc.1',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    status: 'Operational',
    providers: {
      supabase: 'Operational',
      sanity: 'Operational',
      groq: 'Operational',
      jina: 'Operational',
      resend: 'Operational',
      storage: 'Operational',
      calendar: 'Operational',
      database: 'Operational',
      knowledgeIndex: 'Operational'
    },
    features: FEATURES
  });
}
