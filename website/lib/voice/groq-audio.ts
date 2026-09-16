/* eslint-disable @typescript-eslint/no-explicit-any */
import { systemConfig } from '../system/config';
import { chunkForTts, sttContextPrompt, toSpokenText } from './spoken';

const GROQ_AUDIO_BASE = 'https://api.groq.com/openai/v1/audio';
const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

const STT_MODELS = ['whisper-large-v3-turbo', 'whisper-large-v3'] as const;

type TtsPair = { model: string; voice: string; directional: boolean };

const TTS_STACK: TtsPair[] = [
  { model: 'canopylabs/orpheus-v1-english', voice: 'daniel', directional: false },
  { model: 'canopylabs/orpheus-v1-english', voice: 'austin', directional: false },
  { model: 'canopylabs/orpheus-v1-english', voice: 'troy', directional: false },
];

let resolvedTts: TtsPair | null = null;

function apiKey(): string {
  const key = systemConfig.GROQ_API_KEY || process.env.GROQ_API_KEY || '';
  if (!key || key === 'dummy') {
    throw new Error('GROQ_API_KEY is not configured.');
  }
  return key;
}

export type ChatMessage = { role: string; content: string };

export async function transcribeAudio(file: Blob, filename: string, visitorName?: string): Promise<{ text: string; ms: number }> {
  const started = Date.now();
  let lastError = 'Transcription failed.';
  for (const model of STT_MODELS) {
    const form = new FormData();
    form.append('file', file, filename);
    form.append('model', model);
    form.append('language', 'en');
    form.append('temperature', '0');
    form.append('response_format', 'verbose_json');
    form.append('prompt', sttContextPrompt(visitorName));

    const response = await fetch(`${GROQ_AUDIO_BASE}/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey()}` },
      body: form,
    });

    if (!response.ok) {
      lastError = `STT ${response.status}: ${(await response.text()).slice(0, 280)}`;
      if (response.status === 401 || response.status === 403) throw new Error(lastError);
      continue;
    }

    const data = await response.json();
    const text = String(data?.text || '').trim();
    const segments = Array.isArray(data?.segments) ? data.segments : [];
    const noSpeech = segments.length > 0
      ? segments.every((seg: { no_speech_prob?: number }) => Number(seg.no_speech_prob || 0) > 0.55)
      : false;
    const hallucinated = /^(thank you\.?|thanks for watching\.?|bye\.?|you\.?|okay\.?)$/i.test(text);
    return { text: noSpeech || hallucinated ? '' : text, ms: Date.now() - started };
  }
  throw new Error(lastError);
}

async function synthesizeOnce(pair: TtsPair, text: string): Promise<{ mime: string; bytes: Buffer }> {
  const input = toSpokenText(text).slice(0, 200);
  if (!input) throw new Error('Nothing to speak.');
  const body = {
    model: pair.model,
    voice: pair.voice,
    input,
    response_format: 'wav',
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${GROQ_AUDIO_BASE}/speech`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`TTS ${response.status}: ${errText.slice(0, 280)}`);
    }

    const mime = response.headers.get('content-type') || 'audio/wav';
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) throw new Error('TTS returned empty audio.');
    return { mime, bytes };
  } finally {
    clearTimeout(timer);
  }
}

export async function synthesizeSpeech(text: string): Promise<{ mime: string; bytes: Buffer; model: string; voice: string; ms: number }> {
  const chunks = chunkForTts(text);
  if (!chunks.length) throw new Error('Nothing to speak.');
  const started = Date.now();
  const parts: Buffer[] = [];
  let mime = 'audio/wav';
  let model = '';
  let voice = '';
  for (const chunk of chunks) {
    const audio = await synthesizeChunk(chunk);
    mime = audio.mime;
    model = audio.model;
    voice = audio.voice;
    parts.push(audio.bytes);
  }
  return {
    mime,
    bytes: parts.length === 1 ? parts[0]! : concatWav(parts),
    model,
    voice,
    ms: Date.now() - started,
  };
}

async function synthesizeChunk(spoken: string): Promise<{ mime: string; bytes: Buffer; model: string; voice: string }> {
  const stack = resolvedTts ? [resolvedTts, ...TTS_STACK.filter((p) => p !== resolvedTts)] : TTS_STACK;
  let lastError = 'Speech synthesis failed.';

  for (const pair of stack) {
    try {
      const audio = await synthesizeOnce(pair, spoken);
      resolvedTts = pair;
      return { ...audio, model: pair.model, voice: pair.voice };
    } catch (err: any) {
      lastError = err?.message || lastError;
      if (/401|403|invalid api key/i.test(lastError)) throw err;
      if (/terms/i.test(lastError)) {
        throw new Error('Accept the Orpheus TTS terms once in the Groq console, then talk to RAGX again. Same API key. No extra service.');
      }
    }
  }
  throw new Error(lastError);
}

function concatWav(files: Buffer[]): Buffer {
  const pcmParts = files.map((file) => {
    const marker = file.indexOf(Buffer.from('data'));
    if (marker < 0) return file.subarray(Math.min(44, file.length));
    const size = file.readUInt32LE(marker + 4);
    return file.subarray(marker + 8, marker + 8 + size);
  });
  const pcm = Buffer.concat(pcmParts);
  const header = Buffer.alloc(44);
  files[0]!.copy(header, 0, 0, 44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

export async function streamChatCompletion(
  messages: ChatMessage[],
  options: { maxTokens?: number; temperature?: number; timeoutMs?: number; onDelta?: (chunk: string) => void } = {}
): Promise<{ content: string; model: string; ms: number }> {
  const started = Date.now();
  const preferred = systemConfig.RAG_CHAT_MODEL || systemConfig.DEFAULT_FAST_MODEL || 'openai/gpt-oss-20b';
  const fallback = systemConfig.RAG_CHAT_FALLBACK_MODEL || 'openai/gpt-oss-20b';
  const models = preferred === fallback ? [preferred] : [preferred, fallback];

  let lastError = 'Voice generation failed.';
  for (const model of models) {
    try {
      return await streamChatOnce(model, messages, options, started);
    } catch (err: any) {
      lastError = err?.message || lastError;
      if (/401|403|invalid api key/i.test(lastError)) throw err;
    }
  }
  throw new Error(lastError);
}

async function streamChatOnce(
  model: string,
  messages: ChatMessage[],
  options: { maxTokens?: number; temperature?: number; timeoutMs?: number; onDelta?: (chunk: string) => void },
  started: number
): Promise<{ content: string; model: string; ms: number }> {
  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: options.temperature ?? 0.28,
    max_tokens: options.maxTokens ?? 180,
    stream: true,
  };

  if (String(model).includes('qwen')) {
    body.reasoning_effort = 'none';
  } else if (String(model).includes('gpt-oss')) {
    body.reasoning_effort = 'low';
    body.include_reasoning = false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 2800);

  try {
    const response = await fetch(GROQ_CHAT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Chat ${response.status}: ${(await response.text()).slice(0, 280)}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let content = '';
    let usedModel = model;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const json = JSON.parse(payload);
          if (json?.model) usedModel = json.model;
          const delta = json?.choices?.[0]?.delta?.content || json?.choices?.[0]?.message?.content || '';
          if (delta) {
            content += delta;
            options.onDelta?.(delta);
          }
        } catch {
          // incomplete SSE frame
        }
      }
    }

    return { content: content.trim(), model: usedModel, ms: Date.now() - started };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error(`Voice generation timed out after ${options.timeoutMs ?? 2800}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
