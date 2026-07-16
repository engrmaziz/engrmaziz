/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RateLimitError } from '@/lib/utils/errors';
import { logger } from '@/lib/utils/logger';

// Very basic in-memory rate limiting.
// In production on Cloudflare Pages/Workers, this should use Cloudflare KV, Durable Objects, or standard headers.
// Alternatively, Supabase database can be used to track usage if CF bindings aren't set up yet.

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitTracker>();

export async function checkRateLimit(ip: string, endpoint: string, limit: number, windowMs: number) {
  // Bypass or dramatically increase rate limits during local development
  if (process.env.NODE_ENV === "development") {
    limit = 1000;
  }

  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  
  let record = store.get(key);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    store.set(key, record);
    return;
  }

  if (record.count >= limit) {
    logger.warn('Rate limit exceeded', { ip, endpoint, env: process.env.NODE_ENV });
    throw new RateLimitError(`Too many requests to ${endpoint}. Please try again later.`);
  }

  record.count++;
  store.set(key, record);
}

export function getClientIp(request: Request | any): string {
  // 1. Try Vercel specific Real IP
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  // 2. Try Vercel / Standard Forwarded For
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || '127.0.0.1';

  // 3. Try Cloudflare connecting IP header
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;
  
  // 4. Try Next.js native `ip` property on NextRequest
  if (request.ip) return request.ip;
  
  return '127.0.0.1'; // Default fallback
}
