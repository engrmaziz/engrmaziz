import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function main() {
  const { randomUUID } = await import('crypto');
  const { validateStartup } = await import('../lib/system/startup');
  const { ragOrchestrator } = await import('../lib/rag/orchestrator');

  const CASES = [
    { query: 'Who is Musharraf Aziz?', expect: ['engineer', 'ai'] },
    { query: 'What services do you offer?', expect: ['rag', 'agent'] },
    { query: 'What is Dentl2?', expect: ['dental'] },
    { query: 'Explain AegisFlow', expect: ['workflow'] },
    { query: 'Can you build a custom AI call agent?', expect: ['call', 'voice'] }
  ];

  validateStartup();

  console.log('Warmup...');
  await ragOrchestrator.execute({
    query: 'What is VoiceRAG?',
    sessionId: randomUUID(),
    flags: { bypassCache: true },
    internal: true,
  }).catch((err: any) => console.error('warmup failed', err.message));

  let failures = 0;
  for (const test of CASES) {
    const start = Date.now();
    const result = await ragOrchestrator.execute({
      query: test.query,
      sessionId: randomUUID(),
      flags: { bypassCache: true },
    internal: true,
    });
    const ms = Date.now() - start;
    const answer = (result.answer || '').toLowerCase();
    const hits = test.expect.filter((k) => answer.includes(k));
    const okQuality = hits.length >= 1;
    const okSpeed = ms < 500;
    if (!okQuality || !okSpeed) failures += 1;

    console.log('\n---');
    console.log(`Q: ${test.query}`);
    console.log(`latency: ${ms}ms (reported ${result.latencyMs}ms) model=${result.context?.executionContext?.metadata?.agentContext?.lastLlmModel}`);
    console.log(`chunks: ${result.context?.executionContext?.diagnostics?.finalContextChunks} citations: ${result.citations?.length || 0}`);
    console.log(`quality: ${okQuality ? 'PASS' : 'FAIL'} hits=${hits.join(',') || 'none'}`);
    console.log(`speed: ${okSpeed ? 'PASS' : 'FAIL'}`);
    console.log((result.answer || '').slice(0, 500));
  }

  if (failures > 0) {
    console.error(`\nFAILED ${failures}/${CASES.length}`);
    process.exit(1);
  }
  console.log('\nALL CHECKS PASSED');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
