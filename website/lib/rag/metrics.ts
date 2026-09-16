import { localKnowledgeIndex } from './local-index';

let lastTtftMs: number | null = null;

export function recordTtft(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) return;
  lastTtftMs = Math.round(ms);
}

export function getLastTtft(): number | null {
  return lastTtftMs;
}

export function probeTtft(): number {
  const start = performance.now();
  localKnowledgeIndex.ensureLoaded();
  localKnowledgeIndex.search('AegisFlow', 2);
  return Math.max(0, Math.round(performance.now() - start));
}
