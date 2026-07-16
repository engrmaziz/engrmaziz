import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

async function runIndex() {
  const { validateStartup } = require('../lib/system/startup');
  validateStartup();
  
  const { ragIndexer } = require('../lib/rag/indexer');
  
  console.log('Running indexing...');
  const result = await ragIndexer.indexAll();
  console.log(result);
  
  process.exit(0);
}

runIndex().catch(console.error);
