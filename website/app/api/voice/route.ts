/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/utils/response';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { containsPromptInjection, isUuid, sanitizeClientMessages, sanitizeVisitor } from '@/lib/security/input';
import { validateStartup } from '@/lib/system/startup';
import { AppError } from '@/lib/utils/errors';
import { runVoiceGreeting, runVoiceTurn, type VoiceEvent } from '@/lib/voice/pipeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

function sseEncode(event: VoiceEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

function parseVisitor(raw: FormDataEntryValue | null) {
  if (typeof raw !== 'string' || !raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    const name = String(parsed?.name || '');
    const email = String(parsed?.email || '');
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return undefined;
    return sanitizeVisitor({ name, email });
  } catch {
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  try {
    validateStartup();

    const ip = getClientIp(req);
    await checkRateLimit(ip, 'voice', 12, 60000);

    const form = await req.formData();
    const greeting = String(form.get('greeting') || '') === '1';
    let conversationId = String(form.get('conversationId') || '');
    if (!isUuid(conversationId)) conversationId = crypto.randomUUID();

    const visitorInfo = parseVisitor(form.get('visitorInfo'));
    let clientMessages: { role: 'user' | 'assistant'; content: string }[] = [];
    try {
      clientMessages = sanitizeClientMessages(form.get('messages') ? JSON.parse(String(form.get('messages'))) : []);
    } catch {
      clientMessages = [];
    }

    if (!visitorInfo) {
      return errorResponse(new AppError('Identify with name and email before talking to RAGX.', 400, 'IDENTITY_REQUIRED'));
    }

    if (containsPromptInjection(visitorInfo.name)) {
      return errorResponse(new AppError('Please use your real name to continue.', 400, 'VALIDATION_ERROR'));
    }

    const { conversationService } = await import('@/lib/db/services');
    await conversationService.assertVisitorOwnsConversation(conversationId, visitorInfo);

    if (!greeting && !form.get('audio')) {
      return errorResponse(new AppError('Audio is required.', 400, 'VALIDATION_ERROR'));
    }

    const stream = new ReadableStream({
      async start(controller) {
        const emit = (event: VoiceEvent) => {
          controller.enqueue(sseEncode(event));
        };
        try {
          if (greeting) {
            await runVoiceGreeting(emit, visitorInfo, conversationId, clientMessages);
          } else {
            const audioField = form.get('audio');
            const audioBlob = audioField instanceof Blob ? audioField : null;
            if (!audioBlob || audioBlob.size < 200) {
              emit({ type: 'error', message: 'Audio clip was too short. Hold the mic and speak.' });
              controller.close();
              return;
            }
            if (audioBlob.size > MAX_AUDIO_BYTES) {
              emit({ type: 'error', message: 'Audio clip is too large. Try a shorter turn.' });
              controller.close();
              return;
            }
            const mimeType = audioBlob.type || String(form.get('mimeType') || 'audio/webm');
            await runVoiceTurn({
              audio: audioBlob,
              mimeType,
              conversationId,
              visitorInfo,
              messages: clientMessages,
              emit,
            });
          }
        } catch {
          emit({ type: 'error', message: 'Voice pipeline failed. Please try again.' });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: any) {
    if (error instanceof AppError && error.statusCode < 500) {
      return errorResponse(error);
    }
    return errorResponse(new AppError('Voice request failed.', 500, 'VOICE_ERROR'));
  }
}
