/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/utils/response';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { validateStartup } from '@/lib/system/startup';
import { AppError } from '@/lib/utils/errors';
import { runVoiceGreeting, runVoiceTurn, type VoiceEvent } from '@/lib/voice/pipeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

let isInitialized = false;

function sseEncode(event: VoiceEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

export async function POST(req: NextRequest) {
  try {
    if (!isInitialized) {
      validateStartup();
      isInitialized = true;
    }

    const ip = getClientIp(req);
    await checkRateLimit(ip, 'voice', 12, 60000);

    const form = await req.formData();
    const greeting = String(form.get('greeting') || '') === '1';
    const conversationId = String(form.get('conversationId') || '');
    let visitorInfo: { name: string; email: string } | undefined;
    const rawVisitor = form.get('visitorInfo');
    if (typeof rawVisitor === 'string' && rawVisitor) {
      try {
        const parsed = JSON.parse(rawVisitor);
        if (parsed?.name && parsed?.email) visitorInfo = { name: String(parsed.name), email: String(parsed.email) };
      } catch {
        visitorInfo = undefined;
      }
    }

    if (!visitorInfo) {
      return errorResponse(new AppError('Identify with name and email before talking to RAGX.', 400, 'IDENTITY_REQUIRED'));
    }

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
            await runVoiceGreeting(emit, visitorInfo);
          } else {
            const audioField = form.get('audio');
            const audioBlob = audioField instanceof Blob ? audioField : null;
            if (!audioBlob || audioBlob.size < 200) {
              emit({ type: 'error', message: 'Audio clip was too short. Hold the mic and speak.' });
              controller.close();
              return;
            }
            const mimeType = audioBlob.type || String(form.get('mimeType') || 'audio/webm');
            await runVoiceTurn({
              audio: audioBlob,
              mimeType,
              conversationId: conversationId || crypto.randomUUID(),
              visitorInfo,
              emit,
            });
          }
        } catch (err: any) {
          emit({ type: 'error', message: err?.message || 'Voice pipeline failed.' });
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
    if (!(error instanceof AppError)) {
      return errorResponse(new AppError(error?.message || 'Voice request failed.', 500, 'VOICE_ERROR'));
    }
    return errorResponse(error);
  }
}
