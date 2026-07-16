// @ts-nocheck
import { ragRetriever } from '../lib/rag/retriever';
import { ragEmbedder } from '../lib/rag/embedder';
import { retrievalPipeline } from '../lib/retrieval/pipeline';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

async function test() {
  try {
    const q = 'What does he offer?';
    const vec = await ragEmbedder.embed(q);
    
    const dbRes = await retrievalPipeline.retrieve({
        queryEmbedding: vec,
        limit: 200,
        threshold: 0.1,
        strategy: 'vector_only'
    });
    console.log('DB candidates:', dbRes.candidates.length);
    const dbDocs = new Set(dbRes.candidates.map(c => c.metadata?.title || c.document_id));
    console.log('DB unique docs:', dbDocs.size);
    Array.from(dbDocs).forEach(d => console.log(' DB Doc:', d));
    
    const res = await ragRetriever.retrieve(q, 20, 0.1, {}, vec);
    console.log('Retriever chunks:', res.chunks.length);
    console.log('Retriever citations:', res.citations.length);
    res.citations.forEach(c => console.log(' -', c.title));
  } catch(e) { console.error(e); }
}
test();
