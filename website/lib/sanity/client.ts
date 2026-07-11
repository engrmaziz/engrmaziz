/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { createClient } from 'next-sanity';
import { envClient } from '@/lib/config/env.client';
import { envServer } from '@/lib/config/env.server';
import 'server-only';

export const sanityClient = createClient({
  projectId: envClient.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envClient.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: envClient.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-01',
  useCdn: false, // Set to false if you want to ensure fresh data
  token: envServer.SANITY_API_READ_TOKEN || '',
});

// Backward compatible export for files that used the stub 'cms' class
export const cms = {
  fetch: async (query: string, params?: Record<string, unknown>) => {
    return sanityClient.fetch(query, params);
  }
};
