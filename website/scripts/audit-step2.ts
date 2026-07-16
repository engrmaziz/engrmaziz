// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

async function runAudit() {
  const { ragRetriever } = require('../lib/rag/retriever');
  const { jinaReranker } = require('../lib/providers/reranker/jina');
  const { ragDatabase } = require('../lib/rag/supabase');
  const { ragContextBuilder } = require('../lib/rag/context-builder');
  
  const query = "What services does Musharraf offer?";
  console.log(`\n================================`);
  console.log(`AUDIT QUERY: ${query}`);
  console.log(`================================`);

  // 1. Generate query embedding
  const { JinaEmbeddingProvider } = require('../lib/providers/embedding/jina');
  const queryVector = await new JinaEmbeddingProvider().embed(query);

  // 2. Vector Search (Supabase match_chunks) BEFORE reranker
  console.log(`\n--- STEP 2: Verify Vector Search ---`);
  // Retriever uses 200 limit and -1.0 threshold now
  const rawResults = await ragDatabase.matchEmbeddings(queryVector, -1.0, 200, {});
  
  console.log(`Raw chunks returned from Vector DB: ${rawResults.length}`);
  console.log(`Top 30 matches:`);
  
  // Track document hits in top 30
  const docsInTop30 = new Set<string>();
  if (rawResults.length > 0) {
    console.log(`Example Result Keys: ${Object.keys(rawResults[0]).join(', ')}`);
  }
  
  rawResults.slice(0, 30).forEach((res, i) => {
    // Determine the source/title based on metadata
    const meta = typeof res.metadata === 'string' ? JSON.parse(res.metadata) : (res.metadata || {});
    const docSource = meta.source || meta.url || meta.file_path || `doc_id:${res.document_id || res.id}`;
    const docTitle = meta.title || meta.document_title || `Chunk ${res.chunk_number}`;
    const chunkNum = res.chunk_number || res.chunkNumber;
    
    docsInTop30.add(docSource);
    console.log(`${i+1}. [Sim: ${res.similarity.toFixed(4)}] Doc: ${docSource} | Chunk: ${chunkNum} | Title: ${docTitle}`);
  });
  
  // Check if all 4 services are in top 30
  const primaryServices = [
    'services/ai-agents/index.md',
    'services/ai-engineering/index.md',
    'services/software-engineering/index.md',
    'services/technical-consulting/index.md'
  ];
  console.log(`\nPrimary Services in Vector Top 30?`);
  primaryServices.forEach(s => {
    console.log(`- ${s}: ${docsInTop30.has(s) ? 'FOUND' : 'MISSING'}`);
  });

  // 3. Apply Diversity Filter (what retriever.ts does)
  const DIVERSITY_POOL_SIZE = 30;
  const MAX_CHUNKS_PER_DOC = 2;
  const diverseCandidates = [];
  const chunkCountsByDoc = new Map<number, number>();

  for (const chunk of rawResults) {
    if (diverseCandidates.length >= DIVERSITY_POOL_SIZE) break;
    const currentCount = chunkCountsByDoc.get(chunk.document_id) || 0;
    if (currentCount < MAX_CHUNKS_PER_DOC) {
      diverseCandidates.push(chunk);
      chunkCountsByDoc.set(chunk.document_id, currentCount + 1);
    }
  }

  // 4. Verify Reranker
  console.log(`\n--- STEP 3: Verify Reranker ---`);
  const topK = 20;
  console.log(`Sending ${diverseCandidates.length} diverse candidates to Jina Reranker...`);
  
  const { JinaRerankerProvider } = require('../lib/providers/reranker/jina');
  const reranker = new JinaRerankerProvider();
  
  const docsForRerank = diverseCandidates.map(c => ({
    ...c,
    text: c.chunk_text || c.content || ''
  }));
  
  const rerankedCandidates = await reranker.rerank(query, docsForRerank);
  
  const finalReranked = rerankedCandidates.slice(0, topK);

  console.log(`\nTop ${topK} After Reranking:`);
  const finalDocs = new Set<string>();
  finalReranked.forEach((res, i) => {
    const meta = typeof res.metadata === 'string' ? JSON.parse(res.metadata) : (res.metadata || {});
    const docSource = meta.source || meta.url || meta.file_path || `doc_id:${res.document_id || res.id || res.parent_document}`;
    const docTitle = meta.title || meta.document_title || `Chunk ${res.chunk_number}`;
    const chunkNum = res.chunk_number || res.chunkNumber;
    finalDocs.add(docSource);
    console.log(`${i+1}. [Rerank: ${res.relevanceScore?.toFixed(4)}] Doc: ${docSource} | Chunk: ${chunkNum} | Title: ${docTitle}`);
  });

  console.log(`\nPrimary Services in Reranked Top 20?`);
  primaryServices.forEach(s => {
    console.log(`- ${s}: ${finalDocs.has(s) ? 'FOUND' : 'MISSING'}`);
  });

  // 5. Verify Context Builder
  console.log(`\n--- STEP 4: Verify Context Builder ---`);
  
  const mappedForContext = finalReranked.map(res => {
    const meta = typeof res.metadata === 'string' ? JSON.parse(res.metadata) : (res.metadata || {});
    return {
      chunkId: res.chunk_id || res.id || String(res.chunk_number),
      documentId: res.document_id || res.parent_document || meta.source || 'unknown',
      chunkText: res.chunk_text || res.text || res.content || '',
      chunkNumber: res.chunk_number || res.chunkNumber || 0,
      metadata: {
        title: meta.title || meta.document_title || 'Unknown Title',
        url: meta.source || meta.url || meta.file_path || 'unknown_url',
        category: meta.category || 'Service'
      },
      score: res.relevanceScore || res.similarity || 0
    };
  });
  
  const { contextText, citations } = ragContextBuilder.buildContext(mappedForContext as any, 4000);
  
  console.log(`Prompt Context Output Blocks:`);
  citations.forEach((c: any, i: number) => {
    console.log(`${i+1}. ${c.url} - ${c.title}`);
  });

  console.log(`\n--- STEP 5: Verify Prompt ---`);
  console.log(`Context String Length: ${contextText.length} characters`);
  console.log(`Context starts with:\n${contextText.substring(0, 300)}...`);
  
  process.exit(0);
}

runAudit().catch(console.error);
