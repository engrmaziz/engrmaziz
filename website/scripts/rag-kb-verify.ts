import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function main() {
  const { localKnowledgeIndex } = await import('../lib/rag/local-index');
  const queries = [
    'What services does Musharraf offer?',
    'and his experience?',
    'Who is Musharraf Aziz?',
    'How does his RAG stop hallucinations?',
  ];

  for (const query of queries) {
    const hits = localKnowledgeIndex.search(query, 6);
    console.log('\nQUERY:', query);
    for (const hit of hits) {
      const text = (hit.chunkText || '').replace(/\s+/g, ' ').slice(0, 160);
      console.log(`- ${hit.metadata.title} | ${hit.metadata.heading} | ${text}`);
      if (/json-ld|hero section|related services/i.test(hit.chunkText || '')) {
        console.log('  !! BOILERPLATE LEAK');
      }
      if (/^\w{1,3}[a-z]/.test(hit.chunkText || '') && hit.chunkText!.length > 20) {
        // mid-word start like "ombining hardware"
        const first = hit.chunkText!.slice(0, 12);
        if (/^[a-z]/.test(first) && !/^(the |and |for |with )/.test(hit.chunkText!.toLowerCase())) {
          console.log(`  ? starts mid-word?: ${first}`);
        }
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
