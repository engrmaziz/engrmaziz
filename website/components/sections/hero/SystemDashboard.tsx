/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { Activity, Server, Zap, Database, Lock, Cpu, Globe } from "lucide-react";

export function SystemDashboard() {
  const [accuracy, setAccuracy] = useState(0);
  const [response, setResponse] = useState(0);
  const [vector, setVector] = useState(0);

  useEffect(() => {
    // Count-up animation
    let start = 0;
    const endAcc = 98.7;
    const endResp = 43;
    const endVec = 12;
    const duration = 1500; // ms
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuart)
      const ease = 1 - Math.pow(1 - progress, 4);

      setAccuracy(Number((endAcc * ease).toFixed(1)));
      setResponse(Math.floor(endResp * ease));
      setVector(Math.floor(endVec * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <motion.div
      variants={fadeUp}
      className="relative w-full max-w-md mx-auto xl:ml-auto xl:mr-0 z-10"
    >
      {/* Glow effect behind the dashboard */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-accent/20 via-accent/5 to-transparent rounded-2xl blur-xl opacity-50 z-0"></div>
      
      {/* Glass Panel */}
      <div className="relative z-10 bg-elevated/80 backdrop-blur-xl border border-border-default/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col font-mono text-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-base/50 border-b border-border-default/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary tracking-wider">
            <Server className="w-3.5 h-3.5" />
            SYSTEM_MONITOR
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="text-xs text-secondary/80">LIVE</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-6">
          
          {/* Primary Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 p-3 bg-base/40 rounded-lg border border-border-default/30">
              <span className="text-xs text-secondary/70 flex items-center gap-1.5"><Activity className="w-3 h-3 text-accent" /> RAG</span>
              <span className="text-lg font-bold text-primary">{accuracy}%</span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-base/40 rounded-lg border border-border-default/30">
              <span className="text-xs text-secondary/70 flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-500" /> API</span>
              <span className="text-lg font-bold text-primary">{response}ms</span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-base/40 rounded-lg border border-border-default/30">
              <span className="text-xs text-secondary/70 flex items-center gap-1.5"><Database className="w-3 h-3 text-blue-500" /> Vector</span>
              <span className="text-lg font-bold text-primary">{vector}ms</span>
            </div>
          </div>

          {/* Configuration List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-secondary">
                <Cpu className="w-4 h-4 opacity-50" />
                <span>AI Routing</span>
              </div>
              <div className="text-primary font-medium flex items-center gap-2">
                GPT-OSS 20B
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-secondary">
                <Lock className="w-4 h-4 opacity-50" />
                <span>Complex Tasks</span>
              </div>
              <div className="text-primary font-medium flex items-center gap-2">
                GPT-OSS 120B
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-secondary">
                <Database className="w-4 h-4 opacity-50" />
                <span>Embeddings</span>
              </div>
              <div className="text-primary font-medium flex items-center gap-2">
                Jina AI
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-secondary">
                <Server className="w-4 h-4 opacity-50" />
                <span>Infrastructure</span>
              </div>
              <div className="text-primary font-medium">Supabase</div>
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-secondary">
                <Globe className="w-4 h-4 opacity-50" />
                <span>Edge Deploy</span>
              </div>
              <div className="text-primary font-medium">Vercel + CF</div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
