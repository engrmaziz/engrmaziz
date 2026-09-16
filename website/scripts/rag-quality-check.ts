import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

const CASES = [
  'Who is Musharraf Aziz?',
  'What services does Musharraf offer?',
  'and his experience?',
  'Can he build a production voice call agent?',
  'How does his RAG stop hallucinations?',
  'How do I hire him?',
];

const BAD = /json-ld|hero section|related services|development company|& services|We bu\b|ombining /i;

async function main() {
  const { randomUUID } = await import('crypto');
  const { validateStartup } = await import('../lib/system/startup');
  const { ragOrchestrator } = await import('../lib/rag/orchestrator');
  validateStartup();

  let failures = 0;
  for (const query of CASES) {
    const result = await ragOrchestrator.execute({
      query,
      sessionId: randomUUID(),
      flags: { bypassCache: true },
      internal: true,
    });
    const answer = result.answer || '';
    const model = result.context?.executionContext?.metadata?.agentContext?.lastLlmModel || 'unknown';
    const bad = BAD.test(answer);
    const short = answer.length < 180;
    const ok = !bad && !short;
    if (!ok) failures += 1;
    console.log('\n===', query);
    console.log('model=', model, 'ttft=', result.ttftMs, 'len=', answer.length, ok ? 'PASS' : 'FAIL');
    if (bad) console.log('BAD_PATTERN');
    console.log(answer.slice(0, 420));
  }
  if (failures) {
    console.error(`\n${failures} weak answers`);
    process.exitCode = 1;
  } else {
    console.log('\nAll RAG cases passed quality gates.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
