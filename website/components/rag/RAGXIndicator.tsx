/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Cpu, Layers, RefreshCw, AlertCircle, X, ShieldCheck, BrainCircuit } from 'lucide-react';

interface RAGStatus {
  status: 'ONLINE' | 'OFFLINE';
  latency: number;
  embeddingModel: string;
  documents: number;
  chunks: number;
  lastSync: string | null;
  health: 'EXCELLENT' | 'CRITICAL';
}

export function RAGXIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<RAGStatus | null>(null);
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
    } catch (err: any) {
      setError(err.message || String(err));
      setStatus({
        status: 'OFFLINE',
        latency: 0,
        embeddingModel: 'jina-embeddings-v4',
        documents: 0,
        chunks: 0,
        lastSync: null,
        health: 'CRITICAL',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh status check every 60 seconds
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = status?.status === 'ONLINE';

  return (
    <div className="fixed bottom-[104px] right-6 z-50 font-sans">
      {/* Floating Indicator Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchStatus();
        }}
        title="AI Knowledge Engine"
        className="w-12 h-12 rounded-full flex items-center justify-center bg-elevated border border-border-default text-primary hover:border-accent hover:text-accent shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base relative"
        aria-label="AI Knowledge Engine"
      >
        <span className="absolute top-0 right-0 flex h-2.5 w-2.5 -mt-0.5 -mr-0.5">
          {isOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'
            }`}
          ></span>
        </span>
        <BrainCircuit className="w-5 h-5" />
      </button>

      {/* Expandable Status Overlay Card */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop cover overlay to trap blur and focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-base/40 backdrop-blur-sm z-[-1]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute bottom-16 right-0 w-[calc(100vw-3rem)] sm:w-80 max-h-[calc(100vh-268px)] flex flex-col rounded-2xl bg-elevated border border-default shadow-2xl z-50 text-primary overflow-hidden"
            >
              {/* Header Title Bar */}
              <div className="flex items-center justify-between p-5 pb-3 border-b border-default shrink-0 bg-elevated z-10">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold tracking-wide">Knowledge Base Engine</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-secondary hover:text-primary hover:bg-base transition-colors"
                  aria-label="Close RAGX panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Engine Metrics Rows */}
              <div className="flex-1 overflow-y-auto p-5 pt-4 space-y-3.5 text-xs font-mono">
                {/* Connection Health Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Engine Health</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      status?.health === 'EXCELLENT' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {status?.health || 'UNKNOWN'}
                  </span>
                </div>

                {/* Model Configuration */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>Embedding Model</span>
                  </div>
                  <span className="text-secondary truncate max-w-[140px] text-right" title={status?.embeddingModel}>
                    {status?.embeddingModel || 'jina-embeddings-v4'}
                  </span>
                </div>

                {/* Vector Dimensions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Dimensions</span>
                  </div>
                  <span className="font-semibold text-primary">1024</span>
                </div>

                {/* Semantic Cache */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <Database className="h-3.5 w-3.5" />
                    <span>Semantic Cache</span>
                  </div>
                  <span className="font-semibold text-green-500">Enabled</span>
                </div>

                {/* HyDE Generation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <Activity className="h-3.5 w-3.5" />
                    <span>HyDE Generation</span>
                  </div>
                  <span className="font-semibold text-accent">Active</span>
                </div>

                {/* CRAG Evaluation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>CRAG Evaluator</span>
                  </div>
                  <span className="font-semibold text-accent">Active</span>
                </div>

                {/* RRF Fusion */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <Layers className="h-3.5 w-3.5" />
                    <span>RRF Fusion</span>
                  </div>
                  <span className="font-semibold text-accent">Active</span>
                </div>

                {/* Total Indexed Documents */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <Database className="h-3.5 w-3.5" />
                    <span>Indexed Documents</span>
                  </div>
                  <span className="font-semibold text-primary">{status?.documents ?? 0}</span>
                </div>

                {/* Total Database Chunks (pgvector indexes) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Vector Count</span>
                  </div>
                  <span className="font-semibold text-primary">{status?.chunks ?? 0}</span>
                </div>

                {/* DB Latency Check */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Database Latency</span>
                  </div>
                  <span className="font-semibold text-primary">
                    {loading ? 'calculating...' : `${status?.latency ?? 0}ms`}
                  </span>
                </div>

                {/* Last Ingestion Sync Timestamp */}
                <div className="pt-2 border-t border-default mt-2">
                  <div className="text-[10px] text-secondary">
                    Last Indexing Sync:
                  </div>
                  <div className="text-[10px] text-primary mt-0.5">
                    {status?.lastSync ? new Date(status.lastSync).toLocaleString() : 'Never'}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer & Error */}
              <div className="p-5 pt-3 border-t border-default shrink-0 bg-elevated z-10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="flex-1 py-1.5 rounded-lg border border-default text-xs font-semibold hover:border-accent hover:text-accent disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Check
                  </button>
                </div>
                {error && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-start gap-1.5 text-[10px] leading-relaxed">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>Connection refused. Verify PostgreSQL pooler access and local environment values.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
