import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
process.env.JINA_EMBEDDING_MODEL = 'jina-embeddings-v4';

import { ragEmbedder } from '../lib/rag/embedder';
import { pgPool } from '../lib/rag/supabase';

function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function runMathTest() {
  const testText = "The AegisFlow architecture is a powerful orchestration engine designed for high throughput.";
  
  console.log(`[Math] Embedding same text as 'retrieval.query' and 'retrieval.passage'...`);
  const vecQuery = await ragEmbedder.embed(testText, 'retrieval.query');
  const vecPassage = await ragEmbedder.embed(testText, 'retrieval.passage');

  const jsSim = cosineSimilarity(vecQuery, vecPassage);
  console.log(`[Math] JS Local Cosine Similarity: ${jsSim.toFixed(4)}`);

  console.log(`[Math] Query Vector Norm: ${Math.sqrt(vecQuery.reduce((a, b) => a + b * b, 0)).toFixed(4)}`);
  console.log(`[Math] Passage Vector Norm: ${Math.sqrt(vecPassage.reduce((a, b) => a + b * b, 0)).toFixed(4)}`);

  // Let's test inner product (Euclidean dot product)
  const dot = vecQuery.reduce((acc, val, i) => acc + val * vecPassage[i], 0);
  console.log(`[Math] JS Local Dot Product: ${dot.toFixed(4)}`);

  console.log(`[Math] Fetching a real vector from the database to compare...`);
  const dbSample = await pgPool.query('SELECT chunk_text, vector FROM public.document_chunks dc JOIN public.embeddings e ON dc.id = e.chunk_id LIMIT 1');
  if (dbSample.rows.length > 0) {
    const dbText = dbSample.rows[0].chunk_text;
    const dbVecStr = dbSample.rows[0].vector;
    // dbVecStr is a string like "[0.123, -0.456, ...]"
    const dbVec = JSON.parse(dbVecStr);

    console.log(`[Math] DB Text snippet: ${dbText.substring(0, 60)}...`);
    const dbNorm = Math.sqrt(dbVec.reduce((a: number, b: number) => a + b * b, 0));
    console.log(`[Math] DB Vector Norm: ${dbNorm.toFixed(4)}`);

    const newQueryVec = await ragEmbedder.embed(dbText, 'retrieval.query');
    const dbSim = cosineSimilarity(newQueryVec, dbVec);
    console.log(`[Math] Similarity (New Query vs DB Chunk of same text): ${dbSim.toFixed(4)}`);

    const pgCheck = await pgPool.query(`
      SELECT 1 - ($1::vector <=> $2::vector) as pg_sim,
             ($1::vector <#> $2::vector) * -1 as pg_dot
    `, [`[${newQueryVec.join(',')}]`, dbVecStr]);
    console.log(`[Math] pgvector Cosine Sim: ${pgCheck.rows[0].pg_sim}`);
    console.log(`[Math] pgvector Dot Product: ${pgCheck.rows[0].pg_dot}`);
  }

  process.exit(0);
}

runMathTest().catch(console.error);
