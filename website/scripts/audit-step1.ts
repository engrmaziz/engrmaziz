// @ts-nocheck
import { ragDatabase } from '../lib/rag/supabase';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

async function verifyIndexing() {
  console.log('\n--- STEP 1: Verify Indexing ---');
  try {
    const { pgPool } = require('../lib/rag/supabase');
    const cols = await pgPool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'documents'`);
    console.log('Columns:', cols.rows.map((r:any) => r.column_name).join(', '));
    
    const res = await pgPool.query(`
      SELECT 
        id, 
        source as url,
        title
      FROM documents
    `);
    
    console.log('All documents sources:');
    res.rows.forEach((r: any) => {
      console.log(`- ${r.url} | ${r.title}`);
    });
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
verifyIndexing();
