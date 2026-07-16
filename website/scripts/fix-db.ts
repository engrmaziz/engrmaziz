import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

async function fixDbUrl() {
  const { validateStartup } = require('../lib/system/startup');
  validateStartup();
  
  const { createClient } = require('@supabase/supabase-js');
  const ws = require('ws');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    realtime: { transport: ws }
  });
  
  console.log('Fetching document chunks...');
  const { data: chunks, error: cerr } = await client.from('document_chunks').select('id, parent_document, metadata').ilike('chunk_text', '%Enterprise AI Engineering%');
  if (cerr) throw cerr;
  
  if (chunks && chunks.length > 0) {
    for (const chunk of chunks) {
      if (chunk.metadata && chunk.metadata.source && chunk.metadata.source.includes('ai-engineering/index.md')) {
        const meta = typeof chunk.metadata === 'string' ? JSON.parse(chunk.metadata) : chunk.metadata;
        meta.url = '/services/ai-engineering';
        console.log('Updating chunk:', chunk.id);
        await client.from('document_chunks').update({ metadata: meta }).eq('id', chunk.id);
      }
    }
  }
  
  console.log('Done!');
  process.exit(0);
}

fixDbUrl().catch(console.error);
