/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Mail, Trash2, Bot, AlertCircle, Download, LogOut, Mic } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "@/components/markdown/MarkdownComponents";
import { RAGXVoiceHud } from "@/components/rag/RAGXVoiceHud";
import { useRagxVoice } from "@/hooks/useRagxVoice";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: any[];
  isStreaming?: boolean;
}

interface VisitorInfo {
  id: string;
  name: string;
  email: string;
  sessionId: string;
  createdAt: string;
}

interface RAGStatus {
  status: "ONLINE" | "OFFLINE";
  health: "EXCELLENT" | "CRITICAL";
}

const VISITOR_KEY = "ragx_visitor_info";
const HISTORY_KEY = "ragx_history_v2";

function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const SUGGESTIONS = [
  "What services does Musharraf offer?",
  "Can he build a production voice call agent?",
  "How does his RAG stop hallucinations?",
  "How do I hire him?",
];

const ChatMarkdown = {
  ...MarkdownComponents,
  a({ children, href, ...props }: any) {
    const internal = typeof href === "string" && href.startsWith("/");
    return (
      <a
        href={href}
        target={internal ? undefined : "_blank"}
        rel={internal ? undefined : "noopener noreferrer"}
        className="text-[#7DF9FF] underline decoration-[#00D4FF]/40 underline-offset-2 hover:decoration-[#C9A227] break-words"
        {...props}
      >
        {children}
      </a>
    );
  },
  ul({ children, ...props }: any) {
    return <ul className="my-2 ml-4 list-disc space-y-1.5 text-[13px] leading-relaxed text-[#c9d6e3]" {...props}>{children}</ul>;
  },
  li({ children, ...props }: any) {
    return <li className="marker:text-[#00D4FF]" {...props}>{children}</li>;
  },
  p({ children, ...props }: any) {
    return <p className="mb-2 last:mb-0 text-[13px] leading-relaxed text-[#e8f4ff]" {...props}>{children}</p>;
  },
  strong({ children, ...props }: any) {
    return <strong className="text-[#7DF9FF] font-semibold" {...props}>{children}</strong>;
  },
};

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const safeText = text || "";
    if (!safeText) {
      onCompleteRef.current?.();
      return;
    }
    let index = 0;
    setDisplayedText("");
    const id = window.setInterval(() => {
      index = Math.min(index + 3, safeText.length);
      setDisplayedText(safeText.slice(0, index));
      if (index >= safeText.length) {
        window.clearInterval(id);
        onCompleteRef.current?.();
      }
    }, 16);
    return () => window.clearInterval(id);
  }, [text]);

  return (
    <div className="max-w-none break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={ChatMarkdown}>{displayedText}</ReactMarkdown>
    </div>
  );
}

function fmtTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch { return ""; }
}

export function RAGXChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isIdentified, setIsIdentified] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null);
  const [engineStatus, setEngineStatus] = useState<RAGStatus | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportMenuPos, setExportMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("text");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const exportMenuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setConversationId(generateUUID());
    const sv = localStorage.getItem(VISITOR_KEY);
    const sh = localStorage.getItem(HISTORY_KEY);
    let lv: VisitorInfo | null = null;
    if (sv) { try { lv = JSON.parse(sv); setVisitorInfo(lv); setIsIdentified(true); } catch {} }
    if (sh) { try { setHistory(JSON.parse(sh)); } catch {} }
    if (lv) {
      setMessages([{
        id: generateUUID(), role: "assistant", timestamp: new Date().toISOString(),
        content: `Hello ${lv.name}.\n\nI am **RAGX**, Musharraf Aziz's production knowledge assistant.\n\nAsk what he can build, how the stack works, or type **book a meeting**.`
      }]);
    }
    fetch("/api/rag/status").then(r => r.json()).then(d => setEngineStatus(d)).catch(() => setEngineStatus({ status: "OFFLINE", health: "CRITICAL" }));
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    if (!messages.length) return;
    setHistory(prev => {
      const idx = prev.findIndex(h => h.id === conversationId);
      const title = messages.find(m => m.role === "user")?.content.slice(0, 30) || "New Chat";
      const entry = { id: conversationId, title, updatedAt: new Date().toISOString(), messages: messages.map(m => ({ ...m, isStreaming: false })) };
      const next = idx >= 0 ? prev.map((h, i) => i === idx ? { ...h, ...entry } : h) : [entry, ...prev];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [messages, conversationId]);

  useEffect(() => {
    if (isOpen && isIdentified) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      if (mode === "text") setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen, messages, isIdentified, mode]);

  useEffect(() => {
    if (!isOpen) setShowExportMenu(false);
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) setIsOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const target = e.target as Node;
      if (exportButtonRef.current?.contains(target) || exportMenuPanelRef.current?.contains(target)) return;
      setShowExportMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggleExportMenu = () => {
    const btn = exportButtonRef.current;
    if (!btn) {
      setShowExportMenu((open) => !open);
      return;
    }
    const rect = btn.getBoundingClientRect();
    const width = 200;
    const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
    const top = Math.min(rect.bottom + 8, window.innerHeight - 132);
    setExportMenuPos({ top, left });
    setShowExportMenu((open) => !open);
  };

  const welcome = (name: string) => ({
    id: generateUUID(), role: "assistant" as const, timestamp: new Date().toISOString(),
    content: `Hello ${name}.\n\nI am **RAGX**, Musharraf Aziz's production knowledge assistant.\n\nAsk what he can build, how the stack works, or type **book a meeting**.`
  });

  const handleWelcomeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    if (name && email) {
      const nv: VisitorInfo = { id: generateUUID(), name, email, sessionId: generateUUID(), createdAt: new Date().toISOString() };
      setVisitorInfo(nv); localStorage.setItem(VISITOR_KEY, JSON.stringify(nv)); setIsIdentified(true);
      setMessages([welcome(name)]);
    }
  };

  const sendMessage = async (raw: string) => {
    const text = raw.trim();
    if (!text || sessionEnded) return;
    const um: Message = { id: generateUUID(), role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev.filter(m => m.role !== "system"), um]);
    setInputValue(""); setIsLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, message: um.content, visitorInfo }) });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : (data.error?.message || "Error"));
      setMessages(prev => [...prev, { id: generateUUID(), role: "assistant", content: data.data?.content || data.content, citations: data.data?.citations || data.citations, timestamp: new Date().toISOString(), isStreaming: true }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: generateUUID(), role: "system", content: `Error: ${err?.message || "Unknown error"}. Please try again.`, timestamp: new Date().toISOString() }]);
      setInputValue(text);
    } finally { setIsLoading(false); }
  };

  const handleSend = async () => {
    await sendMessage(inputValue);
  };

  const clearConversation = () => {
    setConversationId(generateUUID()); setSessionEnded(false); setSessionSummary(null); setShowHistory(false);
    setMessages([welcome(visitorInfo?.name || "")]);
  };

  const exportMarkdown = () => {
    setShowExportMenu(false);
    const lines = [`# RAGX Chat Export`, ``, `**Visitor:** ${visitorInfo?.name} (${visitorInfo?.email})`, `**Session ID:** ${visitorInfo?.sessionId || conversationId}`, `**Generated:** ${new Date().toLocaleString()}`, ``, `---`, ``];
    messages.filter(m => m.role !== "system").forEach(m => { lines.push(`### ${m.role === "user" ? visitorInfo?.name : "RAGX"} — ${fmtTime(m.timestamp)}`, ``, m.content, ``); });
    if (sessionSummary) { lines.push(`---`, `## AI Session Summary`, ``, sessionSummary); }
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/markdown" })), download: `ragx-chat-${Date.now()}.md` });
    a.click();
  };

  const exportPDF = async () => {
    setShowExportMenu(false);
    try {
      setIsLoading(true);
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      const margin = 20;
      let y = margin;
      const pageWidth = doc.internal.pageSize.width;
      const maxWidth = pageWidth - 2 * margin;

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("RAGX Chat Export", margin, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Visitor: ${visitorInfo?.name} (${visitorInfo?.email})`, margin, y);
      y += 6;
      doc.text(`Session ID: ${visitorInfo?.sessionId || conversationId}`, margin, y);
      y += 6;
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
      y += 15;

      const addWrappedText = (text: string, isUser: boolean, timeStr: string) => {
        // Name & Time
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(isUser ? 59 : 16, isUser ? 130 : 185, isUser ? 246 : 129); // approx colors
        const author = isUser ? (visitorInfo?.name || "You") : "RAGX";
        doc.text(author, margin, y);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150);
        doc.setFontSize(8);
        doc.text(timeStr, margin + doc.getTextWidth(author) + 2, y);
        y += 6;

        // Content
        doc.setFontSize(10);
        doc.setTextColor(30);
        const lines = doc.splitTextToSize(text, maxWidth);
        
        for (let i = 0; i < lines.length; i++) {
          if (y > doc.internal.pageSize.height - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(lines[i], margin, y);
          y += 6;
        }
        y += 6;
      };

      messages.filter(m => m.role !== "system").forEach(m => {
        addWrappedText(m.content, m.role === "user", fmtTime(m.timestamp));
      });

      if (sessionSummary) {
        if (y > doc.internal.pageSize.height - margin - 20) {
          doc.addPage();
          y = margin;
        }
        y += 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text("AI Session Summary", margin, y);
        y += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30);
        const summaryLines = doc.splitTextToSize(sessionSummary, maxWidth);
        for (let i = 0; i < summaryLines.length; i++) {
          if (y > doc.internal.pageSize.height - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(summaryLines[i], margin, y);
          y += 6;
        }
      }

      doc.save(`ragx-chat-${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsLoading(false);
    }
  };

  const appendVoiceUser = (text: string) => {
    const content = text.trim();
    if (!content) return;
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "user" && last.content === content) return prev;
      return [...prev.filter((m) => m.role !== "system"), {
        id: generateUUID(),
        role: "user" as const,
        content,
        timestamp: new Date().toISOString(),
      }];
    });
  };

  const appendVoiceAssistant = (text: string) => {
    const content = text.trim();
    if (!content) return;
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant" && last.content === content) return prev;
      return [...prev, {
        id: generateUUID(),
        role: "assistant" as const,
        content,
        timestamp: new Date().toISOString(),
        isStreaming: false,
      }];
    });
  };

  const voice = useRagxVoice({
    conversationId,
    visitorInfo: visitorInfo ? { name: visitorInfo.name, email: visitorInfo.email } : null,
    enabled: isOpen && mode === "voice" && isIdentified && !sessionEnded,
    identified: isIdentified,
    sessionEnded,
    onUserUtterance: appendVoiceUser,
    onAssistantUtterance: appendVoiceAssistant,
  });

  const openPanel = (nextMode: "text" | "voice") => {
    setMode(nextMode);
    setIsOpen(true);
  };

  const handleEndSession = async () => {
    setShowEndConfirm(false); setIsEndingSession(true);
    try {
      const res = await fetch("/api/chat/end-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, visitorInfo, messages: messagesRef.current, channel: mode }) });
      const data = await res.json();
      if (data.summary) setSessionSummary(data.summary);
      setSessionEnded(true);
      setMessages(prev => [...prev, { id: generateUUID(), role: "assistant", timestamp: new Date().toISOString(), content: `✅ **Session ended.**\n\nThank you, ${visitorInfo?.name}! Your conversation has been saved and a summary sent to Musharraf.\n\nHe typically responds within 24-48 hours. You can also reach him at [io@maziz.me](mailto:io@maziz.me).` }]);
    } catch (err: any) {
      setSessionEnded(true);
      setMessages(prev => [...prev, { id: generateUUID(), role: "system", timestamp: new Date().toISOString(), content: "Session ended locally. Summary generation encountered an error." }]);
    } finally { setIsEndingSession(false); }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openPanel("voice"))}
        className={`cursor-pointer fixed bottom-[6.5rem] right-6 flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_24px_rgba(201,162,39,0.3)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#050a14] z-[100] ${isOpen ? "bg-[#07111f] border border-[#C9A227]/40 text-[#C9A227] scale-0 opacity-0 pointer-events-none" : "bg-[#07111f] border border-[#C9A227]/60 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#050a14] hover:scale-110 opacity-100 scale-100"}`}
        aria-label="Talk to RAGX"
      >
        <span className="absolute inset-0 rounded-full border border-[#C9A227]/30 animate-ping" />
        <Mic className="w-6 h-6 relative z-10" />
      </button>
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openPanel("text"))}
        className={`cursor-pointer fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_24px_rgba(0,212,255,0.35)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:ring-offset-2 focus:ring-offset-[#050a14] z-[100] ${isOpen ? "bg-[#07111f] border border-[#00D4FF]/40 text-[#7DF9FF] rotate-90 scale-0 opacity-0 pointer-events-none" : "bg-[#07111f] border border-[#00D4FF]/50 text-[#7DF9FF] hover:bg-[#00D4FF] hover:text-[#050a14] hover:scale-110 opacity-100 scale-100"}`}
        aria-label="Toggle RAGX Assistant"
      >
        <span className="absolute inset-0 rounded-full border border-[#00D4FF]/30 animate-ping" />
        <span className="absolute top-0 right-0 flex h-3 w-3 -mt-0.5 -mr-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DFF9A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3DFF9A]"></span>
        </span>
        <Bot className="w-6 h-6 relative z-10" />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] pointer-events-none font-sans">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm sm:hidden pointer-events-auto" />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 z-[101] flex flex-col overflow-hidden pointer-events-auto w-full h-[100dvh] sm:w-[440px] sm:h-[680px] sm:max-h-[calc(100vh-120px)] sm:rounded-2xl bg-[#050a14] border border-[#00D4FF]/35 shadow-[0_0_40px_rgba(0,212,255,0.12)]"
              >
                {/* Header */}
                <div className="relative flex items-center justify-between p-4 border-b border-[#00D4FF]/20 bg-[#07111f] shrink-0 overflow-visible">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7DF9FF] to-transparent animate-pulse" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DFF9A] opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3DFF9A]"></span>
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.22em] text-[#8BA0B5]">RAGX // ONLINE</span>
                      {sessionEnded && <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded font-mono">ENDED</span>}
                    </div>
                    <p className="text-sm font-semibold text-[#E8F4FF] mt-1">Musharraf Aziz · Applied AI</p>
                    <p className="text-[11px] font-mono text-[#8BA0B5] mt-0.5">Ask what he ships. Hire when you are ready.</p>
                    <div className="mt-2 inline-flex rounded-lg border border-[#00D4FF]/25 bg-[#050a14] p-0.5">
                      <button
                        type="button"
                        onClick={() => setMode("text")}
                        className={`cursor-pointer min-h-11 px-3 rounded-md font-mono text-[10px] tracking-[0.16em] ${mode === "text" ? "bg-[#00D4FF]/15 text-[#7DF9FF]" : "text-[#8BA0B5] hover:text-[#7DF9FF]"}`}
                      >
                        TEXT
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("voice")}
                        className={`cursor-pointer min-h-11 px-3 rounded-md font-mono text-[10px] tracking-[0.16em] ${mode === "voice" ? "bg-[#C9A227]/15 text-[#C9A227]" : "text-[#8BA0B5] hover:text-[#C9A227]"}`}
                      >
                        VOICE
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button onClick={() => setShowHistory(!showHistory)} className={`p-2 rounded-full transition-colors ${showHistory ? "text-[#7DF9FF] bg-[#00D4FF]/10" : "text-[#8BA0B5] hover:text-[#7DF9FF] hover:bg-[#00D4FF]/10"}`} aria-label="History" title="History"><MessageSquare className="w-4 h-4" /></button>
                    {isIdentified && messages.filter(m => m.role !== "system").length > 1 && (
                      <button
                        ref={exportButtonRef}
                        onClick={toggleExportMenu}
                        className="cursor-pointer p-2 min-h-11 min-w-11 inline-flex items-center justify-center rounded-full text-[#8BA0B5] hover:text-[#7DF9FF] hover:bg-[#00D4FF]/10 transition-colors"
                        aria-label="Export"
                        aria-expanded={showExportMenu}
                        aria-haspopup="menu"
                        title="Export"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {isIdentified && !sessionEnded && messages.filter(m => m.role === "user").length > 0 && (
                      <button onClick={() => setShowEndConfirm(true)} className="p-2 rounded-full text-[#8BA0B5] hover:text-orange-400 hover:bg-orange-500/10 transition-colors" aria-label="End session" title="End Session" disabled={isEndingSession}><LogOut className="w-4 h-4" /></button>
                    )}
                    <button onClick={clearConversation} className="p-2 text-[#8BA0B5] hover:text-[#7DF9FF] hover:bg-[#00D4FF]/10 rounded-full transition-colors" aria-label="New chat" title="New chat"><Trash2 className="w-4 h-4" /></button>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-[#8BA0B5] hover:text-[#E8F4FF] hover:bg-[#00D4FF]/10 rounded-full transition-colors" aria-label="Close"><X className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* End Session Confirm Modal */}
                <AnimatePresence>
                  {showEndConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-base/90 backdrop-blur-sm flex items-center justify-center p-6">
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-elevated border border-border-default rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 mx-auto"><LogOut className="w-6 h-6 text-orange-500" /></div>
                        <h3 className="text-base font-bold text-primary text-center mb-2">End this session?</h3>
                        <p className="text-sm text-secondary text-center mb-6">An AI summary will be generated and sent to Musharraf. Your conversation will be saved.</p>
                        <div className="flex gap-3">
                          <button onClick={() => setShowEndConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-border-default text-sm font-medium text-secondary hover:text-primary transition-colors">Cancel</button>
                          <button onClick={handleEndSession} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 active:scale-95 transition-all">{isEndingSession ? "Ending..." : "End Session"}</button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isIdentified ? (
                  <div className="relative flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center bg-[#050a14]">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                    <div className="relative w-16 h-16 rounded-full border border-[#00D4FF]/40 bg-[#07111f] text-[#7DF9FF] flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(0,212,255,0.25)]">
                      <Bot className="w-8 h-8" />
                      <span className="absolute inset-0 rounded-full border border-[#00D4FF]/30 animate-ping" />
                    </div>
                    <p className="relative font-mono text-[11px] tracking-[0.28em] text-[#3DFF9A] mb-2">CORE LINK</p>
                    <h3 className="relative text-lg font-bold text-[#E8F4FF] mb-2">Identify to talk to RAGX</h3>
                    <p className="relative text-sm text-[#8BA0B5] mb-8 max-w-[280px]">Name and email so Musharraf can follow up. Then ask what he can ship.</p>
                    <form onSubmit={handleWelcomeSubmit} className="relative w-full space-y-3 max-w-xs">
                      <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00D4FF]" /><input type="text" name="name" required placeholder="Your Name" className="w-full pl-10 pr-4 py-3 bg-[#07111f] border border-[#00D4FF]/25 rounded-xl text-sm text-[#E8F4FF] placeholder:text-[#8BA0B5] focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-[#00D4FF] focus:outline-none transition-all" /></div>
                      <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00D4FF]" /><input type="email" name="email" required placeholder="Your Email" className="w-full pl-10 pr-4 py-3 bg-[#07111f] border border-[#00D4FF]/25 rounded-xl text-sm text-[#E8F4FF] placeholder:text-[#8BA0B5] focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-[#00D4FF] focus:outline-none transition-all" /></div>
                      <button type="submit" className="w-full py-3 bg-[#00D4FF] text-[#050a14] rounded-xl text-sm font-semibold hover:bg-[#7DF9FF] active:scale-95 transition-all">Initialize session</button>
                    </form>
                  </div>
                ) : showHistory ? (
                  <div className="flex-1 overflow-y-auto p-4 bg-[#050a14] flex flex-col space-y-2">
                    <h3 className="text-sm font-semibold text-[#E8F4FF] mb-2 px-2 font-mono tracking-wider">SESSION LOG</h3>
                    {history.length === 0 ? <p className="text-sm text-[#8BA0B5] px-2">No previous conversations found.</p> : history.map(h => (
                      <button key={h.id} onClick={() => { setConversationId(h.id); setMessages(h.messages); setShowHistory(false); }} className={`text-left p-3 rounded-xl transition-colors ${h.id === conversationId ? "bg-[#00D4FF]/10 border border-[#00D4FF]/30" : "bg-[#07111f] border border-[#00D4FF]/15 hover:border-[#00D4FF]/40"}`}>
                        <p className="text-sm font-medium text-[#E8F4FF] line-clamp-1">{h.title || "Conversation"}</p>
                        <p className="text-[11px] text-[#8BA0B5] mt-1">{fmtTime(h.updatedAt)}</p>
                      </button>
                    ))}
                    <button onClick={clearConversation} className="mt-4 py-2 flex items-center justify-center gap-2 bg-[#00D4FF]/10 text-[#7DF9FF] rounded-xl text-sm font-medium hover:bg-[#00D4FF] hover:text-[#050a14] transition-all"><MessageSquare className="w-4 h-4" />Start New Chat</button>
                  </div>
                ) : mode === "voice" && !sessionEnded ? (
                  <div className="flex min-h-0 flex-1 flex-col bg-[#050a14]">
                    <RAGXVoiceHud
                      status={voice.status}
                      error={voice.error}
                      level={voice.level}
                      liveTranscript={voice.liveTranscript}
                      timings={voice.timings}
                      supported={voice.supported}
                      sessionLive={voice.sessionLive}
                      disabled={isLoading}
                      reducedMotion={reducedMotion}
                      spectrumRef={voice.spectrumRef}
                      levelRef={voice.levelRef}
                      onToggle={voice.toggle}
                    />
                    <div className="flex justify-between items-center px-4 pb-3">
                      <span className="text-[10px] font-mono text-[#8B9BB4]">Live call · waveform follows you and RAGX</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${engineStatus?.status === "ONLINE" ? "bg-[#3DFF9A]" : "bg-red-500"} ${engineStatus?.status === "ONLINE" ? "animate-pulse" : ""}`}></span>
                        <span className="text-[10px] font-mono text-[#8B9BB4]">{engineStatus?.status === "ONLINE" ? "SYS.NOMINAL" : "OFFLINE"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth bg-[#050a14]">
                      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                      <div className="relative space-y-5">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                          <div className={`flex items-center gap-2 mb-1.5 px-1 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            {msg.role === "assistant" && <div className="w-6 h-6 rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center justify-center shrink-0"><Bot className="w-3.5 h-3.5 text-[#7DF9FF]" /></div>}
                            {msg.role === "user" && <div className="w-6 h-6 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center shrink-0"><User className="w-3.5 h-3.5 text-[#C9A227]" /></div>}
                            {msg.role === "system" && <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0"><AlertCircle className="w-3.5 h-3.5 text-red-500" /></div>}
                            <span className="text-[11px] font-mono tracking-wider text-[#8BA0B5]">{msg.role === "assistant" ? "RAGX" : msg.role === "system" ? "SYSTEM" : visitorInfo?.name || "You"}</span>
                          </div>
                          <div className={`max-w-[90%] p-3.5 rounded-2xl ${msg.role === "user" ? "bg-[#00D4FF] text-[#050a14] rounded-tr-sm shadow-[0_0_16px_rgba(0,212,255,0.25)]" : msg.role === "system" ? "bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-sm text-sm" : "bg-[#07111f] border border-[#00D4FF]/20 text-[#E8F4FF] rounded-tl-sm"}`}>
                            {msg.role === "user" || msg.role === "system" ? (
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            ) : msg.isStreaming ? (
                              <TypewriterText text={msg.content} onComplete={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isStreaming: false } : m))} />
                            ) : (
                              <div className="max-w-none break-words leading-relaxed">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={ChatMarkdown}>{msg.content}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#8BA0B5] mt-1 px-1">{fmtTime(msg.timestamp)}</span>
                        </div>
                      ))}
                      {messages.filter(m => m.role === "user").length === 0 && !isLoading && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {SUGGESTIONS.map((prompt) => (
                            <button
                              key={prompt}
                              type="button"
                              onClick={() => sendMessage(prompt)}
                              className="text-left text-[11px] font-mono tracking-wide px-3 py-2 rounded-lg border border-[#00D4FF]/25 bg-[#07111f] text-[#7DF9FF] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      )}
                      {isLoading && (
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 mb-1.5 px-1"><div className="w-6 h-6 rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center justify-center shrink-0"><Bot className="w-3.5 h-3.5 text-[#7DF9FF]" /></div><span className="text-[11px] font-mono tracking-wider text-[#8BA0B5]">RAGX</span></div>
                          <div className="px-4 py-3 rounded-2xl bg-[#07111f] border border-[#00D4FF]/20 rounded-tl-sm flex items-end gap-1 h-10">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <span
                                key={i}
                                className="w-1 rounded-full bg-[#00D4FF]"
                                style={{
                                  animation: "ragxEq 0.85s ease-in-out infinite",
                                  animationDelay: `${i * 0.12}s`,
                                  height: "8px",
                                }}
                              />
                            ))}
                            <span className="ml-2 font-mono text-[10px] text-[#8BA0B5]">retrieving</span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                      </div>
                    </div>

                    {/* Composer */}
                    <div className="p-4 bg-[#07111f] border-t border-[#00D4FF]/20 shrink-0">
                      {sessionEnded ? (
                        <div className="text-center">
                          <p className="text-sm text-[#8BA0B5] mb-3">This session has ended.</p>
                          <button onClick={clearConversation} className="px-5 py-2.5 bg-[#00D4FF] text-[#050a14] rounded-xl text-sm font-semibold hover:bg-[#7DF9FF] active:scale-95 transition-all">Start New Conversation</button>
                        </div>
                      ) : (
                        <>
                          <div className="relative flex items-end gap-2 bg-[#050a14] border border-[#00D4FF]/25 rounded-2xl focus-within:ring-2 focus-within:ring-[#00D4FF]/40 focus-within:border-[#00D4FF]/50 transition-all px-4 py-3">
                              <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={e => { setInputValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`; }}
                                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!isLoading) handleSend(); } }}
                                placeholder="Ask what Musharraf can ship..."
                                className="flex-1 max-h-[140px] bg-transparent text-sm resize-none focus:outline-none text-[#E8F4FF] placeholder-[#8BA0B5] py-0.5 leading-relaxed"
                                rows={1}
                              />
                              <button type="button" onClick={handleSend} disabled={!inputValue.trim() || isLoading} className="cursor-pointer shrink-0 p-2 min-h-11 min-w-11 rounded-xl bg-[#00D4FF] text-[#050a14] disabled:opacity-40 hover:bg-[#7DF9FF] transition-all self-end" aria-label="Send"><Send className="w-4 h-4" /></button>
                            </div>
                          <div className="flex justify-between items-center mt-2 px-1">
                            <span className="text-[10px] font-mono text-[#8BA0B5]">{mode === "voice" ? "Live call · speak freely · tap to hang up" : "Enter to send"}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${engineStatus?.status === "ONLINE" ? "bg-[#3DFF9A]" : "bg-red-500"} ${engineStatus?.status === "ONLINE" ? "animate-pulse" : ""}`}></span>
                              <span className="text-[10px] font-mono text-[#8BA0B5]">{engineStatus?.status === "ONLINE" ? "SYS.NOMINAL" : "OFFLINE"}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
      {mounted && showExportMenu && exportMenuPos && createPortal(
        <AnimatePresence>
          <motion.div
            ref={exportMenuPanelRef}
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            style={{ position: "fixed", top: exportMenuPos.top, left: exportMenuPos.left, zIndex: 400 }}
            className="w-[200px] rounded-xl border border-[#00D4FF]/35 bg-[#07111f] shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden"
          >
            <button
              type="button"
              role="menuitem"
              onClick={exportMarkdown}
              className="cursor-pointer w-full min-h-11 flex items-center gap-2.5 px-4 py-3 text-sm text-[#E8F4FF] hover:bg-[#00D4FF]/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#7DF9FF]" />
              Markdown (.md)
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={exportPDF}
              className="cursor-pointer w-full min-h-11 flex items-center gap-2.5 px-4 py-3 text-sm text-[#E8F4FF] hover:bg-[#00D4FF]/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#7DF9FF]" />
              PDF
            </button>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
