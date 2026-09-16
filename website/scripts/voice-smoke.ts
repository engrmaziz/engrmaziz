import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function main() {
  const { synthesizeSpeech, transcribeAudio } = await import('../lib/voice/groq-audio');
  const ttsStarted = Date.now();
  const spoken = await synthesizeSpeech('Hello. This is RAGX speaking for Musharraf Aziz.');
  const ttsMs = Date.now() - ttsStarted;
  if (!spoken.bytes.length) throw new Error('TTS returned no audio');

  const wav = new Blob([spoken.bytes], { type: spoken.mime || 'audio/wav' });
  const sttStarted = Date.now();
  const stt = await transcribeAudio(wav, 'greeting.wav');
  const sttMs = Date.now() - sttStarted;
  const heard = (stt.text || '').toLowerCase();
  const ok = heard.includes('ragx') || heard.includes('musharraf') || heard.includes('voice');

  console.log(JSON.stringify({
    ttsOk: true,
    ttsBytes: spoken.bytes.length,
    ttsMs,
    ttsVoice: spoken.voice,
    ttsModel: spoken.model,
    sttMs,
    sttHeard: stt.text.slice(0, 140),
    sttOk: ok,
  }, null, 2));

  if (!ok) process.exit(1);
}

main().catch((err) => {
  console.error('VOICE_SMOKE_FAIL', err?.message || err);
  process.exit(1);
});
