import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { envClient } from '@/lib/config/env.client';
import { envServer } from '@/lib/config/env.server';

// Create a single supabase client for interacting with your database
// This is the admin/service_role client, meaning it bypasses RLS.
// It should ONLY be used in server environments (API routes, Server Components, Server Actions)

// Mock WebSocket for Node.js 20 without native WebSocket
class MockWebSocket {
  constructor() {}
  send() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}

export const supabase = createClient(
  envClient.NEXT_PUBLIC_SUPABASE_URL,
  envServer.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      transport: typeof WebSocket !== 'undefined' ? WebSocket : MockWebSocket as any
    }
  }
);

// Backward compatible export for files that used the stub 'db' class
export const db = {
  select: async (table: string, match: Record<string, unknown>) => {
    return supabase.from(table).select('*').match(match);
  },
  insert: async (table: string, payload: any) => {
    const { data, error } = await supabase.from(table).insert(payload).select().single();
    if (error) throw error;
    return data;
  }
};
