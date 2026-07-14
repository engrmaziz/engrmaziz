import { loadEnvConfig } from '@next/env';
import * as path from 'path';

// Load env variables
loadEnvConfig(path.resolve(__dirname, '..'));

async function main() {
  console.log('==================================================');
  console.log('            RAG KNOWLEDGE INFRASTRUCTURE STATUS    ');
  console.log('==================================================');

  try {
    // Dynamic import to ensure process.env keys are resolved first
    const { ragDatabase } = await import('../lib/rag/supabase');
    const { supabase } = await import('../lib/db/supabase');

    const start = Date.now();
    // Test direct DB query latency
    const { error } = await supabase.from('documents').select('id').limit(1);
    const latency = Date.now() - start;

    if (error) {
      throw error;
    }

    const status = await ragDatabase.getDatabaseStatus();

    console.log(`Database Status:   ONLINE`);
    console.log(`Query Latency:     ${latency}ms`);
    console.log(`Embedding Model:   ${process.env.JINA_EMBEDDING_MODEL || 'jina-embeddings-v4'}`);
    console.log(`Indexed Documents: ${status.documents}`);
    console.log(`Total Chunks:      ${status.chunks}`);
    console.log(`Last Sync:         ${status.latestSync ? new Date(status.latestSync).toLocaleString() : 'Never'}`);
    console.log('==================================================\n');
    process.exit(0);
  } catch (err: any) {
    console.log('Database Status:   OFFLINE');
    console.error('Error fetching database status:', err.message || err);
    console.log('==================================================\n');
    process.exit(1);
  }
}

main();
