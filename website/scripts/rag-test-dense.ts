// @ts-nocheck
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { ragDatabase, pgPool } from '../lib/rag/supabase';
import { ragEmbedder } from '../lib/rag/embedder';

async function testDense() {
  const query = "What is AegisFlow architecture?";
  console.log(`[Test] Embedding Query: "${query}"`);
  
  const queryVector = await ragEmbedder.embed(query);
  console.log(`[Test] Generated vector with length: ${queryVector.length}`);
  
  console.log(`[Test] Executing matchEmbeddings...`);
  // Try with threshold 0.0 to see if anything returns
  const denseResults0 = await ragDatabase.matchEmbeddings(queryVector, 0.0, 50, {});
  console.log(`[Test] matchEmbeddings count (threshold 0.0): ${denseResults0.length}`);
  
  if (denseResults0.length > 0) {
    console.log(`[Test] Top similarity (threshold 0.0):`, denseResults0[0].similarity);
  } else {
    // If 0, let's debug the SQL directly.
    console.log(`[Test] matchEmbeddings count (threshold -1.0):`);
    const denseResultsNeg = await ragDatabase.matchEmbeddings(queryVector, -1.0, 50, {});
    console.log(`[Test] matchEmbeddings count (threshold -1.0): ${denseResultsNeg.length}`);

    // Direct query to check the joined tables
    const vectorString = `[${queryVector.join(',')}]`;
    console.log(`[Test] Checking raw embeddings table for rows...`);
    const countRes = await pgPool.query('SELECT count(*) FROM public.embeddings');
    console.log(`[Test] public.embeddings row count: ${countRes.rows[0].count}`);

    const countDC = await pgPool.query('SELECT count(*) FROM public.document_chunks');
    console.log(`[Test] public.document_chunks row count: ${countDC.rows[0].count}`);

    const joinCheck = await pgPool.query(`
      SELECT count(*) 
      FROM public.embeddings e
      JOIN public.document_chunks dc ON dc.id = e.chunk_id
    `);
    console.log(`[Test] e JOIN dc row count: ${joinCheck.rows[0].count}`);
    
    // Check top 1 distance explicitly
    const rawSql = `
      SELECT 
        1 - (e.vector <=> $1) as similarity
      FROM public.embeddings e
      ORDER BY e.vector <=> $1 ASC
      LIMIT 1;
    `;
    const topMatch = await pgPool.query(rawSql, [vectorString]);
    console.log(`[Test] Best possible similarity without joins or filters:`, topMatch.rows[0]?.similarity);
  }
  process.exit(0);
}

testDense().catch(e => {
  console.error(e);
  process.exit(1);
});
