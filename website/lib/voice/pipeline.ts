/* eslint-disable @typescript-eslint/no-explicit-any */
import { ragRetriever } from '../rag/retriever';
import { ragMemory } from '../rag/memory';
import { promptBuilder } from '../rag/prompt-builder';
import { expandFollowUpQuery } from '../rag/identity';
import { withTimeout } from '../rag/timing';
import { buildGroundedFallback } from '../rag/extractive';
import { streamChatCompletion, synthesizeSpeech, transcribeAudio } from './groq-audio';
import { lockVisitorAddress, pullCompleteSentences, spokenIntentReply, toSpokenText, VOICE_GREETING, VOICE_MISHEAR } from './spoken';
import { recordVoiceTelemetry } from './metrics';
import {
  alreadySentMeeting,
  formatBookingEmail,
  formatSessionState,
  isBookingQuery,
  mergeHistories,
  resolveBookingReply,
  slotsFromSession,
  type ChatTurn,
} from '../rag/session-memory';

export type VoiceEvent =
  | { type: 'transcript'; text: string; sttMs: number }
  | { type: 'status'; stage: 'rag' | 'tts' }
  | { type: 'answer'; text: string; ragMs: number }
  | { type: 'audio'; mime: string; b64: string; sentenceIndex: number }
  | { type: 'tts_fallback'; text: string }
  | { type: 'done'; timings: VoiceTimings; modelUsed: string; voice: string }
  | { type: 'error'; message: string };

export type VoiceTimings = {
  sttMs: number;
  ragMs: number;
  ttsMs: number;
  totalMs: number;
  ttfaMs: number;
};

type Visitor = { name: string; email: string };

function filenameFor(type: string): string {
  if (type.includes('mp4') || type.includes('m4a')) return 'turn.m4a';
  if (type.includes('mpeg') || type.includes('mp3')) return 'turn.mp3';
  if (type.includes('wav')) return 'turn.wav';
  if (type.includes('ogg')) return 'turn.ogg';
  return 'turn.webm';
}

function createSpeaker(emit: (event: VoiceEvent) => void, started: number) {
  const state = {
    ttsMs: 0,
    voice: 'austin',
    model: '',
    firstAudioAt: null as number | null,
    index: 0,
    chain: Promise.resolve(),
  };

  const speak = (sentence: string) => {
    const clean = toSpokenText(sentence);
    if (clean.length < 8) return;
    state.chain = state.chain.then(async () => {
      try {
        const tts = await synthesizeSpeech(clean);
        state.ttsMs += tts.ms;
        state.voice = tts.voice;
        state.model = tts.model;
        if (state.firstAudioAt === null) state.firstAudioAt = Date.now() - started;
        emit({
          type: 'audio',
          mime: tts.mime,
          b64: tts.bytes.toString('base64'),
          sentenceIndex: state.index++,
        });
      } catch {
        // skip a failed sentence so the rest of the turn can still speak
      }
    });
  };

  return {
    state,
    speak,
    flush: () => state.chain,
  };
}

export async function runVoiceGreeting(
  emit: (event: VoiceEvent) => void,
  visitor?: Visitor,
  conversationId?: string,
  clientMessages?: ChatTurn[]
) {
  const started = Date.now();
  const name = visitor?.name?.split(' ')[0];
  const history = conversationId
    ? (await withTimeout(ragMemory.loadSession(conversationId, clientMessages), 800, { history: clientMessages || [], summary: null })).history
    : mergeHistories(clientMessages);
  const alreadyTalking = history.some((turn) => turn.role === 'assistant' || turn.role === 'user');
  const text = alreadyTalking
    ? (name ? `I'm listening, ${name}. Pick up where we left off.` : "I'm listening. Pick up where we left off.")
    : name
      ? `Hello ${name}. I am RAGX, Musharraf Aziz's assistant. Tell me what you want him to ship.`
      : VOICE_GREETING;
  emit({ type: 'answer', text, ragMs: 0 });
  emit({ type: 'status', stage: 'tts' });
  const speaker = createSpeaker(emit, started);
  speaker.speak(text);
  await speaker.flush();
  if (speaker.state.index === 0) {
    emit({ type: 'tts_fallback', text });
  }
  if (conversationId && !alreadyTalking) {
    await ragMemory.createConversation(conversationId).catch(() => undefined);
    await ragMemory.saveAssistantMessage(conversationId, text).catch(() => undefined);
  }
  emit({
      type: 'done',
      modelUsed: speaker.state.model,
      voice: speaker.state.voice,
      timings: {
        sttMs: 0,
        ragMs: 0,
        ttsMs: speaker.state.ttsMs,
        totalMs: Date.now() - started,
        ttfaMs: speaker.state.firstAudioAt ?? Date.now() - started,
      },
    });
    recordVoiceTelemetry({
      ttfaMs: speaker.state.firstAudioAt ?? Date.now() - started,
      sttMs: 0,
      ragMs: 0,
      ttsMs: speaker.state.ttsMs,
      totalMs: Date.now() - started,
      voice: speaker.state.voice,
      model: speaker.state.model,
    });
}

export async function runVoiceTurn(opts: {
  audio: Blob;
  mimeType: string;
  conversationId: string;
  visitorInfo: Visitor;
  messages?: ChatTurn[];
  emit: (event: VoiceEvent) => void;
}) {
  const started = Date.now();
  const { emit } = opts;
  const stt = await transcribeAudio(opts.audio, filenameFor(opts.mimeType), opts.visitorInfo.name);
  const transcript = stt.text.replace(/\s+/g, ' ').trim();
  emit({ type: 'transcript', text: transcript, sttMs: stt.ms });

  const speaker = createSpeaker(emit, started);
  let spoken = '';
  let ragMs = 0;
  let modelUsed = 'intent-router';

  const finish = async () => {
    await speaker.flush();
    if (speaker.state.index === 0 && spoken) {
      speaker.speak(spoken);
      await speaker.flush();
    }
    if (speaker.state.index === 0 && spoken) {
      emit({ type: 'tts_fallback', text: spoken });
    }
    try {
      await ragMemory.createConversation(opts.conversationId);
    } catch {
      // conversation may already exist
    }
    if (transcript) await ragMemory.saveUserMessage(opts.conversationId, transcript).catch(() => undefined);
    if (spoken) await ragMemory.saveAssistantMessage(opts.conversationId, spoken).catch(() => undefined);
    emit({
      type: 'done',
      modelUsed: modelUsed || speaker.state.model,
      voice: speaker.state.voice,
      timings: {
        sttMs: stt.ms,
        ragMs,
        ttsMs: speaker.state.ttsMs,
        totalMs: Date.now() - started,
        ttfaMs: speaker.state.firstAudioAt ?? Date.now() - started,
      },
    });
    recordVoiceTelemetry({
      ttfaMs: speaker.state.firstAudioAt ?? Date.now() - started,
      sttMs: stt.ms,
      ragMs,
      ttsMs: speaker.state.ttsMs,
      totalMs: Date.now() - started,
      voice: speaker.state.voice,
      model: modelUsed || speaker.state.model,
    });
  };

  if (/\b(hire|meet|book)\b/i.test(transcript)) {
    void import('@/lib/services/LeadScoringService').then(({ leadScoring }) => {
      const score = leadScoring.calculateScore({ email: opts.visitorInfo.email, projectDescription: transcript });
      if (score > 50) {
        void import('@/lib/email/resend').then(({ emailService }) => {
          emailService.sendContactNotification({
            ...opts.visitorInfo,
            message: transcript,
            projectType: 'RAGX Voice Lead',
          }).catch(() => undefined);
        });
      }
    }).catch(() => undefined);
  }

  if (transcript.length < 2) {
    spoken = VOICE_MISHEAR;
    emit({ type: 'answer', text: spoken, ragMs: 0 });
    emit({ type: 'status', stage: 'tts' });
    speaker.speak(spoken);
    await finish();
    return;
  }

  const intent = spokenIntentReply(transcript, opts.visitorInfo.name);
  const isGreetingIntent = /^(hello|hi|hey|greetings|how are you|good morning|good afternoon|what's up|yo)\b/i.test(transcript) && transcript.length < 40;
  const session = opts.conversationId
    ? await withTimeout(ragMemory.loadSession(opts.conversationId, opts.messages), 800, { history: opts.messages || [], summary: null })
    : { history: opts.messages || [], summary: null };
  const history = mergeHistories(session.history, opts.messages);
  const slots = slotsFromSession(history, transcript, opts.visitorInfo);
  const bookingReply = resolveBookingReply({ slots, query: transcript, history, channel: 'voice' });

  if (intent && !(isGreetingIntent && history.length > 0) && !isBookingQuery(transcript) && !bookingReply) {
    spoken = lockVisitorAddress(intent, opts.visitorInfo.name);
    emit({ type: 'answer', text: spoken, ragMs: 0 });
    emit({ type: 'status', stage: 'tts' });
    speaker.speak(spoken);
    await finish();
    return;
  }

  if (bookingReply) {
    spoken = lockVisitorAddress(bookingReply, opts.visitorInfo.name);
    emit({ type: 'answer', text: spoken, ragMs: 0 });
    emit({ type: 'status', stage: 'tts' });
    speaker.speak(spoken);
    if (/meeting request has been sent/i.test(spoken) && !alreadySentMeeting(history)) {
      void import('@/lib/email/resend').then(({ emailService }) => {
        emailService.sendContactNotification({
          name: opts.visitorInfo.name,
          email: opts.visitorInfo.email,
          projectType: 'Booking Request',
          message: formatBookingEmail(slots, history, transcript),
        }).catch(() => undefined);
      }).catch(() => undefined);
    }
    await finish();
    return;
  }

  emit({ type: 'status', stage: 'rag' });
  const ragStarted = Date.now();
  const optimized = expandFollowUpQuery(transcript, history);
  const retrieval = await ragRetriever.retrieve(optimized, 5, 0.22, {});
  const messages = promptBuilder.buildPrompt(
    session.summary,
    history,
    retrieval.contextText || '',
    transcript,
    [],
    opts.visitorInfo,
    { channel: 'voice', sessionState: formatSessionState(slots, history.length) }
  );

  let pending = '';
  const spokenParts: string[] = [];
  emit({ type: 'status', stage: 'tts' });

  try {
    const streamed = await streamChatCompletion(messages, {
      maxTokens: 180,
      temperature: 0.28,
      timeoutMs: 2600,
      onDelta: (chunk) => {
        pending += chunk;
        const { ready, rest } = pullCompleteSentences(pending);
        pending = rest;
        for (const sentence of ready) {
          const clean = lockVisitorAddress(sentence, opts.visitorInfo.name);
          if (clean.length < 8) continue;
          spokenParts.push(clean);
          spoken = spokenParts.join(' ');
          emit({ type: 'answer', text: spoken, ragMs: Date.now() - ragStarted });
          speaker.speak(clean);
        }
      },
    });
    ragMs = Date.now() - ragStarted;
    modelUsed = streamed.model;
    const remainder = lockVisitorAddress(pending, opts.visitorInfo.name);
    if (remainder.length >= 8) {
      spokenParts.push(remainder);
      speaker.speak(remainder);
    }
    spoken = lockVisitorAddress(spokenParts.join(' ') || streamed.content, opts.visitorInfo.name);
  } catch {
    ragMs = Date.now() - ragStarted;
    modelUsed = 'grounded-fallback';
    spoken = '';
  }

  if (!spoken || spoken.length < 24) {
    spoken = lockVisitorAddress(buildGroundedFallback(retrieval.chunks || [], transcript), opts.visitorInfo.name);
    emit({ type: 'answer', text: spoken, ragMs });
    if (speaker.state.index === 0) speaker.speak(spoken);
  } else {
    emit({ type: 'answer', text: spoken, ragMs });
  }

  await finish();
}
