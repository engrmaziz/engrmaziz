/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Cpu, Layers, RefreshCw, AlertCircle, X, ShieldCheck, BrainCircuit, Zap, Mic } from 'lucide-react';

interface VoiceStats {
  ttfaMs: number;
  sttMs: number;
  ragMs: number;
  ttsMs: number;
  totalMs: number;
  voice: string;
  model: string;
  updatedAt: string;
}

interface RAGStatus {
  status: 'ONLINE' | 'OFFLINE';
  latency: number;
  ttft: number;
  embeddingModel: string;
  documents: number;
  chunks: number;
  lastSync: string | null;
  health: 'EXCELLENT' | 'CRITICAL';
  voice?: VoiceStats | null;
}

const VOICE_KEY = 'ragx_voice_telemetry';

function readLocalVoice(): VoiceStats | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(VOICE_KEY);
    return raw ? (JSON.parse(raw) as VoiceStats) : null;
  } catch {
    return null;
  }
}

export function RAGXIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<RAGStatus | null>(null);
  const [voice, setVoice] = useState<VoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/rag/status');
      if (!response.ok) {
        throw new Error('Failed to retrieve RAG engine status');
      }
      const data = await response.json();
      setStatus(data);
      setVoice(data.voice || readLocalVoice());
    } catch (err: any) {
      setError(err.message || String(err));
      setStatus({
        status: 'OFFLINE',
        latency: 0,
        ttft: 0,
        embeddingModel: 'jina-embeddings-v4',
        documents: 0,
        chunks: 0,
        lastSync: null,
        health: 'CRITICAL',
      });
      setVoice(readLocalVoice());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    const onVoice = () => setVoice(readLocalVoice());
    window.addEventListener('ragx-voice-telemetry', onVoice);
    return () => {
      clearInterval(interval);
      window.removeEventListener('ragx-voice-telemetry', onVoice);
    };
  }, []);

  const isOnline = status?.status === 'ONLINE';
  const voiceStats = voice || status?.voice || null;

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchStatus();
        }}
        title="Knowledge Base Engine"
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#00D4FF]/50 bg-[#07111f] text-[#7DF9FF] shadow-[0_0_24px_rgba(0,212,255,0.28)] transition-all duration-200 hover:bg-[#00D4FF] hover:text-[#050a14] focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:ring-offset-2 focus:ring-offset-[#050a14]"
        aria-label="Knowledge Base Engine"
      >
        <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-3 w-3">
          {isOnline ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3DFF9A] opacity-75" />
          ) : null}
          <span className={`relative inline-flex h-3 w-3 rounded-full ${isOnline ? 'bg-[#3DFF9A]' : 'bg-red-500 animate-pulse'}`} />
        </span>
        <BrainCircuit className="relative z-10 h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[-1] bg-base/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute bottom-16 left-0 z-50 flex max-h-[calc(100vh-140px)] w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-[#00D4FF]/35 bg-[#07111f] text-[#E8F4FF] shadow-2xl sm:w-80"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-[#00D4FF]/20 bg-[#07111f] p-5 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#00D4FF]" />
                  <span className="text-sm font-semibold tracking-wide">Knowledge Base Engine</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer rounded-md p-2 text-[#8BA0B5] transition-colors hover:bg-[#00D4FF]/10 hover:text-[#7DF9FF]"
                  aria-label="Close knowledge base panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3.5 overflow-y-auto p-5 pt-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#8BA0B5]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Engine Health</span>
                  </div>
                  <span className={`font-semibold ${status?.health === 'EXCELLENT' ? 'text-[#3DFF9A]' : 'text-red-400'}`}>
                    {status?.health || 'UNKNOWN'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#8BA0B5]">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>Embedding Model</span>
                  </div>
                  <span className="max-w-[140px] truncate text-right text-[#8BA0B5]" title={status?.embeddingModel}>
                    {status?.embeddingModel || 'jina-embeddings-v4'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#8BA0B5]">
                    <Database className="h-3.5 w-3.5" />
                    <span>Indexed Documents</span>
                  </div>
                  <span className="font-semibold text-[#E8F4FF]">{status?.documents ?? 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#8BA0B5]">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Vector Count</span>
                  </div>
                  <span className="font-semibold text-[#E8F4FF]">{status?.chunks ?? 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#8BA0B5]">
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Database Latency</span>
                  </div>
                  <span className="font-semibold text-[#E8F4FF]">
                    {loading ? 'calculating...' : `${status?.latency ?? 0}ms`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#8BA0B5]">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Chat TTFT</span>
                  </div>
                  <span className="font-semibold text-[#E8F4FF]" title="Time to first token">
                    {loading ? 'calculating...' : `${status?.ttft ?? 0}ms`}
                  </span>
                </div>

                <div className="mt-2 border-t border-[#00D4FF]/20 pt-3">
                  <div className="mb-2.5 flex items-center gap-2 text-[#C9A227]">
                    <Mic className="h-3.5 w-3.5" />
                    <span className="font-semibold tracking-wide">Voice agent</span>
                  </div>
                  {voiceStats ? (
                    <>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#8BA0B5]">Voice</span>
                        <span className="font-semibold text-[#E8F4FF]">{voiceStats.voice}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#8BA0B5]">Model</span>
                        <span className="max-w-[150px] truncate text-right text-[#8BA0B5]" title={voiceStats.model}>
                          {voiceStats.model.replace('canopylabs/', '')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#8BA0B5]">TTFA</span>
                        <span className="font-semibold text-[#E8F4FF]">{Math.round(voiceStats.ttfaMs)}ms</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#8BA0B5]">STT</span>
                        <span className="font-semibold text-[#E8F4FF]">{Math.round(voiceStats.sttMs)}ms</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#8BA0B5]">RAG</span>
                        <span className="font-semibold text-[#E8F4FF]">{Math.round(voiceStats.ragMs)}ms</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#8BA0B5]">TTS</span>
                        <span className="font-semibold text-[#E8F4FF]">{Math.round(voiceStats.ttsMs)}ms</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-[11px] leading-relaxed text-[#8BA0B5]">
                      No live voice turn yet. Start a call from the gold mic to populate latency and voice name.
                    </p>
                  )}
                </div>

                <div className="mt-2 border-t border-[#00D4FF]/20 pt-2">
                  <div className="text-[10px] text-[#8BA0B5]">Last indexing sync</div>
                  <div className="mt-0.5 text-[10px] text-[#E8F4FF]">
                    {status?.lastSync ? new Date(status.lastSync).toLocaleString() : 'Never'}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-3 border-t border-[#00D4FF]/20 bg-[#07111f] p-5 pt-3">
                <button
                  type="button"
                  onClick={fetchStatus}
                  disabled={loading}
                  className="flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#00D4FF]/25 py-1.5 text-xs font-semibold transition-colors hover:border-[#00D4FF] hover:text-[#7DF9FF] disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Check
                </button>
                {error ? (
                  <div className="flex items-start gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-[10px] leading-relaxed text-red-400">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>Connection refused. Verify PostgreSQL pooler access and local environment values.</span>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
