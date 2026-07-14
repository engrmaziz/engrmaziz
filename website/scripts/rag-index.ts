import { loadEnvConfig } from '@next/env';
import * as path from 'path';

// Load env variables from .env.local synchronously at the start
loadEnvConfig(path.resolve(__dirname, '..'));

async function main() {
  console.log('==================================================');
  console.log('            RAG KNOWLEDGE BASE INDEXER            ');
  console.log('==================================================');
  
  try {
    // Dynamic import to ensure process.env keys are resolved first
    const { ragIndexer } = await import('../lib/rag/indexer');
    const result = await ragIndexer.indexAll();
    
    console.log('\n==================================================');
    console.log('              INDEXING SUMMARY                    ');
    console.log('==================================================');
    console.log(`Total Files Scanned: ${result.total}`);
    console.log(`Successfully Indexed: ${result.indexed}`);
    console.log(`Skipped (Checksum OK): ${result.skipped}`);
    console.log(`Failed Files: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.log('\nErrors encountered:');
      result.errors.forEach((err) => {
        console.log(`- ${err.file}: ${err.error}`);
      });
    }
    console.log('==================================================\n');
    process.exit(result.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal error during indexing operation:', error);
    process.exit(1);
  }
}

main();
