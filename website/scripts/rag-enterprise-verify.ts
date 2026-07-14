import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { pgPool } from '../lib/rag/supabase';
import { ragEmbedder } from '../lib/rag/embedder';

async function verifyEnterpriseRAG() {
  console.log("==========================================");
  console.log("ENTERPRISE RAG DIAGNOSTIC VERIFICATION");
  console.log("==========================================");

  try {
    // 1. Verify Model Layers
    const envModel = process.env.JINA_EMBEDDING_MODEL || 'NOT SET';
    // Access private property for diagnostic purposes
    const embedderModel = (ragEmbedder as any).getModel(); 
    
    const dbModelRes = await pgPool.query('SELECT DISTINCT embedding_model FROM public.embeddings LIMIT 1');
    const dbModel = dbModelRes.rows[0]?.embedding_model || 'NO VECTORS';

    console.log("\n[1] MODEL VERIFICATION");
    console.log(`.env.local:       ${envModel}`);
    console.log(`embedder.ts:      ${embedderModel}`);
    console.log(`embeddings table: ${dbModel}`);
    console.log(`MATCH:            ${embedderModel === dbModel ? 'TRUE' : 'FALSE'}`);

    // 2. Verify Vector Normalization
    console.log("\n[2] VECTOR NORMALIZATION VERIFICATION");
    const normRes = await pgPool.query(`
      SELECT 
        AVG(vector_norm(vector)) as avg_norm,
        MIN(vector_norm(vector)) as min_norm,
        MAX(vector_norm(vector)) as max_norm
      FROM public.embeddings
    `);
    console.log(`Average: ${normRes.rows[0].avg_norm}`);
    console.log(`Min:     ${normRes.rows[0].min_norm}`);
    console.log(`Max:     ${normRes.rows[0].max_norm}`);

    // 3. Verify Cosine Similarity Manually (Top 20)
    console.log("\n[3] MANUAL COSINE SIMILARITY (TOP 20 - NO THRESHOLD)");
    const testQuery = "What is AegisFlow architecture?";
    const queryVector = await ragEmbedder.embed(testQuery, 'retrieval.query');
    const vectorString = `[${queryVector.join(',')}]`;

    const top20Res = await pgPool.query(`
      SELECT 
        1 - (e.vector <=> $1::vector) as similarity
      FROM public.embeddings e
      ORDER BY e.vector <=> $1::vector ASC
      LIMIT 20
    `, [vectorString]);

    top20Res.rows.forEach((row, i) => {
      console.log(`${String(i + 1).padStart(2, ' ')}. ${row.similarity.toFixed(4)}`);
    });

    console.log("\n==========================================");
    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

verifyEnterpriseRAG();
