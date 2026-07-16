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
  const { validateStartup } = require('../lib/system/startup');
  validateStartup();
  
  const { ragRetriever } = require('../lib/rag/retriever');
  
  const query = "What services does Musharraf offer?";
  console.log(`\n================================`);
  console.log(`PIPELINE QUERY: ${query}`);
  console.log(`================================`);

  // We are going to call the exact method the route uses:
  // const retrievalResult = await ragRetriever.retrieve(ctx.request.optimizedQuery, 20, -1.0, filters, queryVector);
  
  const result = await ragRetriever.retrieve(query, 20, -1.0, {});
  
  console.log('\n--- FINAL PROMPT CITATIONS ---');
  result.citations.forEach((c: any, i: number) => {
    console.log(`${i+1}. ${c.url} - ${c.title}`);
  });
  
  const primaryServices = [
    'services/ai-agents/index.md',
    'services/ai-engineering/index.md',
    'services/software-engineering/index.md',
    'services/technical-consulting/index.md'
  ];
  
  console.log(`\nPrimary Services in Final Citations?`);
  const finalUrls = new Set(result.citations.map((c: any) => c.url));
  primaryServices.forEach(s => {
    console.log(`- ${s}: ${finalUrls.has(s) ? 'FOUND' : 'MISSING'}`);
  });
  
  process.exit(0);
}

runAudit().catch(console.error);
