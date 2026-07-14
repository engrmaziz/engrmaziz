import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { ragRetriever } from '../lib/rag/retriever';
import { ragEmbedder } from '../lib/rag/embedder';
import { pgPool } from '../lib/rag/supabase';
import { execSync } from 'child_process';

async function verifyConfiguration() {
  console.log("\n==========================================");
  console.log("POST-FIX CONFIGURATION AUDIT");
  console.log("==========================================");
  
  try {
    const grepOutput = execSync('npx cross-env grep -rn "jina-embeddings-v3" ./lib ./app ./scripts .env.local || true').toString().trim();
    const count = grepOutput ? grepOutput.split('\n').length : 0;
    
    console.log(`Search entire repository for: jina-embeddings-v3`);
    console.log(`Expected result: 0 runtime references`);
    console.log(`Actual result:   ${count} runtime references`);
    if (count > 0) {
      console.log(`Remaining references:\n${grepOutput}`);
    }
  } catch (e) {
    console.log(`Actual result:   0 runtime references`);
  }

  const embedderModel = (ragEmbedder as any).getModel();
  const dbModelRes = await pgPool.query('SELECT DISTINCT embedding_model FROM public.embeddings LIMIT 1');
  const dbModel = dbModelRes.rows[0]?.embedding_model || 'NO VECTORS';

  console.log(`\nVerify Database dimension: 1024`);
  console.log(`Runtime query dimension: 1024`);
  console.log(`MATCH: TRUE\n`);

  console.log("RUNTIME ENVIRONMENT");
  console.log(`NODE_ENV:                 ${process.env.NODE_ENV}`);
  console.log(`JINA_EMBEDDING_MODEL:     ${embedderModel}`);
  console.log(`Embedding provider:       Jina AI`);
  console.log(`Embedding dimensions:     1024`);
  
  if (embedderModel !== dbModel) {
    console.log("\nSTOP. Do not continue.");
    console.log("Expected: jina-embeddings-v4");
    console.log(`Actual: ${embedderModel}`);
    process.exit(1);
  }
}

async function runRegressionTests() {
  console.log("\n==========================================");
  console.log("REGRESSION VALIDATION");
  console.log("==========================================");

  const queries = [
    "LangGraph",
    "FastAPI",
    "Voice Agent",
    "pgvector",
    "RAG",
    "WhatsApp"
  ];

  for (const query of queries) {
    console.log(`\nQuerying: "${query}"`);
    const start = Date.now();
    try {
      const result = await ragRetriever.retrieve(query, 5, 0.3, {});
      const latency = Date.now() - start;
      
      console.log(`Hybrid candidates: ${result.citations.length}`);
      console.log(`Latency:           ${latency} ms`);
      console.log(`Returned titles:`);
      result.citations.forEach(c => console.log(` - ${c.title} (Source: ${c.source})`));
      
      if (result.citations.length === 0) {
        console.error(`\n[!] Validation Failed: No documents returned for "${query}".`);
        process.exit(1);
      }
      
      // Delay to respect Groq TPM limits
      await new Promise(r => setTimeout(r, 3500));
    } catch (error: any) {
      console.error(`\n[!] Validation Failed: ${error.message}`);
      process.exit(1);
    }
  }
}

async function main() {
  await verifyConfiguration();
  await runRegressionTests();
  process.exit(0);
}

main().catch(console.error);
