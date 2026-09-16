export type VoiceTelemetry = {
  ttfaMs: number;
  sttMs: number;
  ragMs: number;
  ttsMs: number;
  totalMs: number;
  voice: string;
  model: string;
  updatedAt: string;
};

let lastVoice: VoiceTelemetry | null = null;

export function recordVoiceTelemetry(partial: Partial<VoiceTelemetry> & Pick<VoiceTelemetry, 'ttfaMs' | 'voice'>) {
  lastVoice = {
    ttfaMs: Math.round(partial.ttfaMs || 0),
    sttMs: Math.round(partial.sttMs || 0),
    ragMs: Math.round(partial.ragMs || 0),
    ttsMs: Math.round(partial.ttsMs || 0),
    totalMs: Math.round(partial.totalMs || 0),
    voice: partial.voice || 'daniel',
    model: partial.model || 'canopylabs/orpheus-v1-english',
    updatedAt: new Date().toISOString(),
  };
  return lastVoice;
}

export function getLastVoiceTelemetry(): VoiceTelemetry | null {
  return lastVoice;
}
