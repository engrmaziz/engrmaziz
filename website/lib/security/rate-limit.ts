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

async function checkSharedLimit(key: string, limit: number, windowMs: number): Promise<boolean | null> {
  try {
    const { supabase } = await import('@/lib/db/supabase');
    const now = Date.now();
    const { data, error } = await supabase
      .from('api_rate_limits')
      .select('count, reset_time')
      .eq('key', key)
      .maybeSingle();

    if (error) return null;

    const row = data as { count?: number; reset_time?: number } | null;
    if (!row || Number(row.reset_time) < now) {
      const { error: upsertError } = await supabase.from('api_rate_limits').upsert({
        key,
        count: 1,
        reset_time: now + windowMs,
      });
      if (upsertError) return null;
      return true;
    }

    const count = Number(row.count) || 0;
    if (count >= limit) return false;

    const { error: updateError } = await supabase
      .from('api_rate_limits')
      .update({ count: count + 1 })
      .eq('key', key);
    if (updateError) return null;
    return true;
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
    logger.warn('Rate limit exceeded', { ip, endpoint, store: 'supabase' });
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
