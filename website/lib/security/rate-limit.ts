import { RateLimitError } from '@/lib/utils/errors';
import { logger } from '@/lib/utils/logger';

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

type HeaderReader = {
  headers: {
    get(name: string): string | null;
  };
  ip?: string | undefined;
};

const memoryStore = new Map<string, RateLimitTracker>();
let tableReady: Promise<boolean> | null = null;

async function ensureRateLimitTable(): Promise<boolean> {
  if (tableReady) return tableReady;
  tableReady = (async () => {
    try {
      const { pgPool } = await import('@/lib/rag/supabase');
      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS public.api_rate_limits (
          key text PRIMARY KEY,
          count integer NOT NULL DEFAULT 0,
          reset_time bigint NOT NULL
        )
      `);
      return true;
    } catch (error) {
      logger.warn('Shared rate-limit table unavailable; using in-memory fallback', {
        error: error instanceof Error ? error.message : 'unknown',
      });
      return false;
    }
  })();
  return tableReady;
}

async function checkSharedLimit(key: string, limit: number, windowMs: number): Promise<boolean | null> {
  try {
    const ready = await ensureRateLimitTable();
    if (!ready) return null;
    const { pgPool } = await import('@/lib/rag/supabase');
    const now = Date.now();
    const resetTime = now + windowMs;
    const { rows } = await pgPool.query<{ count: number }>(
      `INSERT INTO public.api_rate_limits (key, count, reset_time)
       VALUES ($1, 1, $2)
       ON CONFLICT (key) DO UPDATE SET
         count = CASE
           WHEN public.api_rate_limits.reset_time < $3 THEN 1
           ELSE public.api_rate_limits.count + 1
         END,
         reset_time = CASE
           WHEN public.api_rate_limits.reset_time < $3 THEN $2
           ELSE public.api_rate_limits.reset_time
         END
       RETURNING count`,
      [key, resetTime, now]
    );
    return (rows[0]?.count ?? 1) <= limit;
  } catch (error) {
    logger.warn('Shared rate-limit check failed; using in-memory fallback', {
      error: error instanceof Error ? error.message : 'unknown',
    });
    return null;
  }
}

function checkMemoryLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = memoryStore.get(key);
  if (!record || now > record.resetTime) {
    memoryStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count += 1;
  memoryStore.set(key, record);
  return true;
}

export async function checkRateLimit(ip: string, endpoint: string, limit: number, windowMs: number) {
  if (process.env.NODE_ENV === 'development') {
    limit = 1000;
  }

  const key = `${ip}:${endpoint}`;
  const shared = await checkSharedLimit(key, limit, windowMs);
  if (shared === false) {
    logger.warn('Rate limit exceeded', { ip, endpoint, store: 'postgres' });
    throw new RateLimitError(`Too many requests to ${endpoint}. Please try again later.`);
  }
  if (shared === true) return;

  if (!checkMemoryLimit(key, limit, windowMs)) {
    logger.warn('Rate limit exceeded', { ip, endpoint, store: 'memory' });
    throw new RateLimitError(`Too many requests to ${endpoint}. Please try again later.`);
  }
}

export function getClientIp(request: HeaderReader): string {
  const vercel = request.headers.get('x-vercel-forwarded-for');
  if (vercel) return vercel.split(',')[0]?.trim() || '127.0.0.1';

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const hops = forwardedFor.split(',').map((part) => part.trim()).filter(Boolean);
    return hops[hops.length - 1] || '127.0.0.1';
  }

  if (request.ip) return request.ip;
  return '127.0.0.1';
}
