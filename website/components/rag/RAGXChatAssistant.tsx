/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Mail, Trash2, Bot, AlertCircle, Download, LogOut } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "@/components/markdown/MarkdownComponents";

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

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    const safeText = text || "";
    if (!safeText) { if (onComplete) onComplete(); return; }
    let index = 0;
    const id = setInterval(() => {
      setDisplayedText(safeText.slice(0, index));
      index += 3;
      if (index > safeText.length) { clearInterval(id); setDisplayedText(safeText); if (onComplete) onComplete(); }
    }, 15);
    return () => clearInterval(id);
  }, [text, onComplete]);
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{displayedText}</ReactMarkdown>
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
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

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
        content: `Hello ${lv.name} 👋\n\nI'm RAGX, Musharraf Aziz's AI Knowledge Assistant.\n\nAsk me anything about his services, projects, or expertise — or type **"book a meeting"** to schedule a call.\n\n*Example: "What AI services does he offer?"*`
      }]);
    }
    fetch("/api/rag/status").then(r => r.json()).then(d => setEngineStatus(d)).catch(() => setEngineStatus({ status: "OFFLINE", health: "CRITICAL" }));
  }, []);

  useEffect(() => {
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
    if (isOpen && isIdentified) { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); setTimeout(() => textareaRef.current?.focus(), 100); }
  }, [isOpen, messages, isIdentified]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) setIsOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) setShowExportMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const welcome = (name: string) => ({
    id: generateUUID(), role: "assistant" as const, timestamp: new Date().toISOString(),
    content: `Hello ${name} 👋\n\nI'm RAGX, Musharraf Aziz's AI Knowledge Assistant.\n\nAsk me anything about his services, projects, or expertise — or type **"book a meeting"** to schedule a call.\n\n*Example: "What AI services does he offer?"*`
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

  const handleSend = async () => {
    if (!inputValue.trim() || sessionEnded) return;
    const um: Message = { id: generateUUID(), role: "user", content: inputValue.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev.filter(m => m.role !== "system"), um]);
    setInputValue(""); setIsLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, message: um.content, visitorInfo }) });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : (data.error?.message || "Error"));
      setMessages(prev => [...prev, { id: generateUUID(), role: "assistant", content: data.data?.content || data.content, citations: data.data?.citations || data.citations, timestamp: new Date().toISOString(), isStreaming: true }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: generateUUID(), role: "system", content: `Error: ${err?.message || "Unknown error"}. Please try again.`, timestamp: new Date().toISOString() }]);
      setInputValue(um.content);
    } finally { setIsLoading(false); }
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

  const handleEndSession = async () => {
    setShowEndConfirm(false); setIsEndingSession(true);
    try {
      const res = await fetch("/api/chat/end-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, visitorInfo, messages }) });
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
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 z-[100] ${isOpen ? "bg-elevated/80 backdrop-blur-md border border-border-default text-primary rotate-90 scale-0 opacity-0 pointer-events-none" : "bg-elevated/80 backdrop-blur-md border border-border-default text-accent hover:bg-accent hover:text-white hover:scale-110 opacity-100 scale-100"}`}
        aria-label="Toggle AI Assistant"
      >
        <span className="absolute top-0 right-0 flex h-3 w-3 -mt-0.5 -mr-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
        </span>
        <Bot className="w-6 h-6" />
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
                className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 z-[101] flex flex-col bg-elevated/95 backdrop-blur-xl border border-border-default shadow-2xl overflow-hidden pointer-events-auto w-full h-[100dvh] sm:w-[420px] sm:h-[650px] sm:max-h-[calc(100vh-120px)] sm:rounded-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-default bg-base shrink-0">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xl leading-none">🧠</span>
                      <span className="font-bold text-primary text-base">RAGX Assistant</span>
                      {sessionEnded && <span className="text-[10px] bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded font-medium">Ended</span>}
                    </div>
                    <p className="text-xs text-secondary mt-0.5">Ask about services, projects, or expertise.</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button onClick={() => setShowHistory(!showHistory)} className={`p-2 rounded-full transition-colors ${showHistory ? "text-accent bg-accent/10" : "text-secondary hover:text-accent hover:bg-accent/10"}`} aria-label="History" title="History"><MessageSquare className="w-4 h-4" /></button>
                    {isIdentified && messages.filter(m => m.role !== "system").length > 1 && (
                      <div className="relative" ref={exportMenuRef}>
                        <button onClick={() => setShowExportMenu(!showExportMenu)} className="p-2 rounded-full text-secondary hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Export" title="Export"><Download className="w-4 h-4" /></button>
                        <AnimatePresence>
                          {showExportMenu && (
                            <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} className="absolute right-0 top-10 bg-elevated border border-border-default rounded-xl shadow-xl z-50 overflow-hidden min-w-[150px]">
                              <button onClick={exportMarkdown} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary hover:bg-accent/10 transition-colors"><Download className="w-3.5 h-3.5 text-accent" />Markdown (.md)</button>
                              <button onClick={exportPDF} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary hover:bg-accent/10 transition-colors"><Download className="w-3.5 h-3.5 text-accent" />PDF</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    {isIdentified && !sessionEnded && messages.filter(m => m.role === "user").length > 0 && (
                      <button onClick={() => setShowEndConfirm(true)} className="p-2 rounded-full text-secondary hover:text-orange-500 hover:bg-orange-500/10 transition-colors" aria-label="End session" title="End Session" disabled={isEndingSession}><LogOut className="w-4 h-4" /></button>
                    )}
                    <button onClick={clearConversation} className="p-2 text-secondary hover:text-accent hover:bg-accent/10 rounded-full transition-colors" aria-label="New chat" title="New chat"><Trash2 className="w-4 h-4" /></button>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-secondary hover:text-primary hover:bg-border-default rounded-full transition-colors" aria-label="Close"><X className="w-5 h-5" /></button>
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
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center bg-base">
                    <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4"><MessageSquare className="w-8 h-8" /></div>
                    <h3 className="text-lg font-bold text-primary mb-2">Welcome to RAGX</h3>
                    <p className="text-sm text-secondary mb-8 max-w-[280px]">Before we begin, please introduce yourself. Your conversation will be securely saved.</p>
                    <form onSubmit={handleWelcomeSubmit} className="w-full space-y-3 max-w-xs">
                      <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" /><input type="text" name="name" required placeholder="Your Name" className="w-full pl-10 pr-4 py-3 bg-elevated border border-border-default rounded-xl text-sm focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all" /></div>
                      <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" /><input type="email" name="email" required placeholder="Your Email" className="w-full pl-10 pr-4 py-3 bg-elevated border border-border-default rounded-xl text-sm focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all" /></div>
                      <button type="submit" className="w-full py-3 bg-accent text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-accent-hover active:scale-95 transition-all">Start Conversation</button>
                    </form>
                  </div>
                ) : showHistory ? (
                  <div className="flex-1 overflow-y-auto p-4 bg-base flex flex-col space-y-2">
                    <h3 className="text-sm font-semibold text-primary mb-2 px-2">Chat History</h3>
                    {history.length === 0 ? <p className="text-sm text-secondary px-2">No previous conversations found.</p> : history.map(h => (
                      <button key={h.id} onClick={() => { setConversationId(h.id); setMessages(h.messages); setShowHistory(false); }} className={`text-left p-3 rounded-xl transition-colors ${h.id === conversationId ? "bg-accent/10 border border-accent/20" : "bg-elevated border border-border-default hover:bg-accent/5"}`}>
                        <p className="text-sm font-medium text-primary line-clamp-1">{h.title || "Conversation"}</p>
                        <p className="text-[11px] text-secondary mt-1">{fmtTime(h.updatedAt)}</p>
                      </button>
                    ))}
                    <button onClick={clearConversation} className="mt-4 py-2 flex items-center justify-center gap-2 bg-accent/10 text-accent rounded-xl text-sm font-medium hover:bg-accent hover:text-white transition-all"><MessageSquare className="w-4 h-4" />Start New Chat</button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth bg-base">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                          <div className={`flex items-center gap-2 mb-1.5 px-1 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            {msg.role === "assistant" && <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0"><Bot className="w-3.5 h-3.5 text-accent" /></div>}
                            {msg.role === "user" && <div className="w-6 h-6 rounded-full bg-border-default flex items-center justify-center shrink-0"><User className="w-3.5 h-3.5 text-secondary" /></div>}
                            {msg.role === "system" && <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0"><AlertCircle className="w-3.5 h-3.5 text-red-500" /></div>}
                            <span className="text-[11px] font-medium text-primary">{msg.role === "assistant" ? "RAGX" : msg.role === "system" ? "System" : visitorInfo?.name || "You"}</span>
                          </div>
                          <div className={`max-w-[88%] p-3.5 rounded-2xl ${msg.role === "user" ? "bg-accent text-white rounded-tr-sm shadow-sm" : msg.role === "system" ? "bg-red-500/10 border border-red-500/20 text-red-500 rounded-tl-sm text-sm" : "bg-elevated border border-border-default text-primary rounded-tl-sm shadow-sm"}`}>
                            {msg.role === "user" || msg.role === "system" ? (
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            ) : msg.isStreaming ? (
                              <TypewriterText text={msg.content} onComplete={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isStreaming: false } : m))} />
                            ) : (
                              <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{msg.content}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-secondary mt-1 px-1">{fmtTime(msg.timestamp)}</span>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 mb-1.5 px-1"><div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0"><Bot className="w-3.5 h-3.5 text-accent" /></div><span className="text-[11px] font-medium text-primary">RAGX</span></div>
                          <div className="max-w-[80%] px-4 py-3.5 rounded-2xl bg-elevated border border-border-default rounded-tl-sm shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Composer */}
                    <div className="p-4 bg-elevated border-t border-border-default shrink-0">
                      {sessionEnded ? (
                        <div className="text-center">
                          <p className="text-sm text-secondary mb-3">This session has ended.</p>
                          <button onClick={clearConversation} className="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-hover active:scale-95 transition-all">Start New Conversation</button>
                        </div>
                      ) : (
                        <>
                          <div className="relative flex items-end gap-2 bg-base border border-border-default rounded-2xl focus-within:ring-2 focus-within:ring-accent/60 focus-within:border-accent/40 transition-all shadow-sm px-4 py-3">
                            <textarea
                              ref={textareaRef}
                              value={inputValue}
                              onChange={e => { setInputValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`; }}
                              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                              placeholder="Ask anything about Musharraf or his services..."
                              disabled={isLoading}
                              className="flex-1 max-h-[140px] bg-transparent text-sm resize-none focus:outline-none disabled:opacity-50 text-primary placeholder-secondary py-0.5 leading-relaxed"
                              rows={1}
                            />
                            <button onClick={handleSend} disabled={!inputValue.trim() || isLoading} className="shrink-0 p-2 rounded-xl bg-accent text-white shadow-sm disabled:opacity-40 hover:bg-accent-hover hover:shadow transition-all self-end" aria-label="Send"><Send className="w-4 h-4" /></button>
                          </div>
                          <div className="flex justify-between items-center mt-2 px-1">
                            <span className="text-[10px] text-secondary">Enter to send · Shift+Enter for newline</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${engineStatus?.status === "ONLINE" ? "bg-green-500" : "bg-red-500"}`}></span>
                              <span className="text-[10px] text-secondary">{engineStatus?.status === "ONLINE" ? "Online" : "Offline"}</span>
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
    </div>
  );
}
