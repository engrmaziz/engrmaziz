/* eslint-disable */
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { sanityWebhook } from '@/lib/sanity/webhook';
import { env } from '@/lib/config/env';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // 1. Validate Sanity Webhook Secret
    const authHeader = req.headers.get('sanity-webhook-signature');
    if (!authHeader || authHeader !== env.SANITY_WEBHOOK_SECRET) {
      throw new Error("Unauthorized Webhook Signature");
    }

    const payload = await req.json();

    // 2. Route to automation handler
    if (payload._type === 'post' && payload.publishedAt) {
      await sanityWebhook.processPublish(payload);
    }

    return successResponse({ received: true });
  } catch (error) {
    return errorResponse(error);
  }
}
