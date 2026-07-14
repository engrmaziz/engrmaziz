import { loadEnvConfig } from '@next/env';
import * as path from 'path';

// Load env variables
loadEnvConfig(path.resolve(__dirname, '..'));

async function main() {
  const query = process.argv.slice(2).join(' ');

  if (!query) {
    console.log('Usage: npm run rag:search "<search query>"');
    process.exit(1);
  }

  console.log('==================================================');
  console.log(`Searching RAG Context for: "${query}"`);
  console.log('==================================================\n');

  try {
    // Dynamic import to ensure process.env keys are resolved first
    const { ragRetriever } = await import('../lib/rag/retriever');

    const start = Date.now();
    const result = await ragRetriever.retrieve(query, 5);
    const duration = Date.now() - start;

    console.log(`Retrieval completed in ${duration}ms.\n`);
    console.log(`Found ${result.chunks.length} matching contexts:\n`);

    result.chunks.forEach((chunk, index) => {
      console.log(`[${index + 1}] Score: ${(chunk.score * 100).toFixed(1)}% | Document: ${chunk.metadata.title} | Section: ${chunk.metadata.section}`);
      console.log(`--------------------------------------------------`);
      console.log(chunk.chunkText);
      console.log(`==================================================\n`);
    });

    if (result.chunks.length === 0) {
      console.log('No matching segments found.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Retrieval testing failed:', error);
    process.exit(1);
  }
}

main();
