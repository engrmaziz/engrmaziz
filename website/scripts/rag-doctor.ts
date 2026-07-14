import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { ragDatabase, pgPool } from '../lib/rag/supabase';
import { ragEmbedder } from '../lib/rag/embedder';

async function runDoctor() {
  console.log('==================================================');
  console.log('            RAG SYSTEM DOCTOR                     ');
  console.log('==================================================');
  
  let issues = 0;

  // 1. Check Database Connection
  process.stdout.write('Checking Supabase Database Connection... ');
  try {
    await pgPool.query('SELECT 1');
    console.log('✅ OK');
  } catch (err: any) {
    console.log(`❌ FAILED (${err.message})`);
    issues++;
  }

  // 2. Check Embedding Model API
  process.stdout.write('Checking Jina Embeddings v3 API... ');
  try {
    await ragEmbedder.embed('doctor check', 'retrieval.query');
    console.log('✅ OK');
  } catch (err: any) {
    console.log(`❌ FAILED (${err.message})`);
    issues++;
  }

  // 3. Verify Vector Schema
  process.stdout.write('Verifying pgvector dimensions schema... ');
  try {
    const schemaCheck = await pgPool.query(`
      SELECT data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'embeddings' AND column_name = 'vector'
    `);
    if (schemaCheck.rows.length > 0 && schemaCheck.rows[0].udt_name === 'vector') {
      console.log('✅ OK');
    } else {
      console.log('❌ FAILED (Vector column missing or wrong type)');
      issues++;
    }
  } catch (err: any) {
    console.log(`❌ FAILED (${err.message})`);
    issues++;
  }

  // 4. Validate Environment Variables
  process.stdout.write('Validating Environment Variables... ');
  const missingVars = [];
  if (!process.env.JINA_API_KEY) missingVars.push('JINA_API_KEY');
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.GROQ_API_KEY) missingVars.push('GROQ_API_KEY');

  if (missingVars.length === 0) {
    console.log('✅ OK');
  } else {
    console.log(`❌ MISSING (${missingVars.join(', ')})`);
    issues++;
  }

  console.log('==================================================');
  if (issues === 0) {
    console.log('✅ RAG System is completely healthy and production-ready.');
    process.exit(0);
  } else {
    console.error(`❌ Found ${issues} critical issues. Fix them before indexing.`);
    process.exit(1);
  }
}

runDoctor().catch(err => {
  console.error("Doctor execution failed:", err);
  process.exit(1);
});
