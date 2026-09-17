import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { envClient } from '@/lib/config/env.client';
import { envServer } from '@/lib/config/env.server';

// Service-role client. Bypass RLS. Server-only (API routes, Server Components, Server Actions).
export const supabase = createClient(
  envClient.NEXT_PUBLIC_SUPABASE_URL,
  envServer.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const db = {
  select: async (table: string, match: Record<string, unknown>) => {
    return supabase.from(table).select('*').match(match);
  },
  insert: async (table: string, payload: object) => {
    const { data, error } = await supabase.from(table).insert(payload as never).select().single();
    if (error) throw error;
    return data;
  }
};
