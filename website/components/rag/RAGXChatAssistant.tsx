/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Mail, Trash2, Bot, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownComponents } from '@/components/markdown/MarkdownComponents';

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
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
  status: 'ONLINE' | 'OFFLINE';
  health: 'EXCELLENT' | 'CRITICAL';
}

const VISITOR_KEY = 'ragx_visitor_info';
const HISTORY_KEY = 'ragx_history_v2';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    const safeText = text || '';
    if (!safeText) {
      if (onComplete) onComplete();
      return;
    }
    
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(safeText.slice(0, index));
      index += 3;
      if (index > safeText.length) {
        clearInterval(intervalId);
        setDisplayedText(safeText);
        if (onComplete) onComplete();
      }
    }, 15);
    
    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
        {displayedText}
      </ReactMarkdown>
    </div>
  );
}

export function RAGXChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isIdentified, setIsIdentified] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null);
  const [engineStatus, setEngineStatus] = useState<RAGStatus | null>(null);
  
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
    const storedVisitor = localStorage.getItem(VISITOR_KEY);
    const storedHistory = localStorage.getItem(HISTORY_KEY);

    if (!conversationId) {
      setConversationId(generateUUID());
    }

    let loadedVisitor = null;
    if (storedVisitor) {
      try {
        loadedVisitor = JSON.parse(storedVisitor);
        setVisitorInfo(loadedVisitor);
        setIsIdentified(true);
      } catch (e) {}
    }

    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {}
    }
    
    // Explicitly add welcome message on fresh mount if visitor is identified
    // but the current session is brand new
    if (loadedVisitor && messages.length === 0) {
      const welcomeMsg: Message = {
        id: generateUUID(),
        role: 'assistant',
        content: `Hello ${loadedVisitor.name} 👋\n\nI'm the RAGX Knowledge Assistant.\n\nAsk me anything about our company, services, projects, or expertise.\n\nExample prompts:\n- *"How does your RAG pipeline work?"*\n- *"What AI services do you offer?"*`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMsg]);
    }

    fetch('/api/rag/status')
      .then(res => res.json())
      .then(data => setEngineStatus(data))
      .catch(() => setEngineStatus({ status: 'OFFLINE', health: 'CRITICAL' }));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setHistory(prev => {
        const existingIdx = prev.findIndex(h => h.id === conversationId);
        const title = messages.find(m => m.role === 'user')?.content.slice(0, 30) || 'New Chat';
        
        const newEntry = {
          id: conversationId,
          title,
          updatedAt: new Date().toISOString(),
          messages: messages.map(m => ({ ...m, isStreaming: false })) // don't persist streaming state
        };
        
        let newHistory;
        if (existingIdx >= 0) {
          newHistory = [...prev];
          newHistory[existingIdx] = { ...prev[existingIdx], ...newEntry };
        } else {
          newHistory = [newEntry, ...prev];
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [messages, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && isIdentified) {
      scrollToBottom();
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen, messages, isIdentified]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleWelcomeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    if (name && email) {
      const newVisitor: VisitorInfo = {
        id: generateUUID(),
        name,
        email,
        sessionId: generateUUID(),
        createdAt: new Date().toISOString()
      };
      setVisitorInfo(newVisitor);
      localStorage.setItem(VISITOR_KEY, JSON.stringify(newVisitor));
      setIsIdentified(true);
      
      const welcomeMsg: Message = {
        id: generateUUID(),
        role: 'assistant',
        content: `Hello ${name} 👋\n\nI'm the RAGX Knowledge Assistant.\n\nAsk me anything about our company, services, projects, or expertise.\n\nExample prompts:\n- *"How does your RAG pipeline work?"*\n- *"What AI services do you offer?"*`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMsg]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: generateUUID(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      // Remove any trailing error messages from system before adding user message
      const filtered = prev.filter(m => m.role !== 'system');
      return [...filtered, userMessage];
    });
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: userMessage.content,
          visitorInfo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error 
          ? (typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error))) 
          : 'Failed to communicate with RAG engine.';
        throw new Error(errorMsg);
      }

      setMessages(prev => [...prev, {
        id: generateUUID(),
        role: 'assistant',
        content: data.data?.content || data.content,
        citations: data.data?.citations || data.citations,
        timestamp: new Date().toISOString(),
        isStreaming: true
      }]);
    } catch (error: any) {
      // Robust error extractor
      const extractErrorMessage = (err: any): string => {
        if (!err) return 'An unknown error occurred.';
        if (typeof err === 'string') return err;
        if (err.message) return err.message;
        if (err.error?.message) return err.error.message;
        if (err.error && typeof err.error === 'string') return err.error;
        if (err.error && typeof err.error === 'object') return JSON.stringify(err.error);
        return String(err);
      };

      const errorMessage = extractErrorMessage(error);
      
      setMessages(prev => [...prev, {
        id: generateUUID(),
        role: 'system',
        content: `Connection error: ${errorMessage}. Please try sending your message again.`,
        timestamp: new Date().toISOString()
      }]);
      // Put message back in input if it failed, so user doesn't lose it
      setInputValue(userMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setConversationId(generateUUID());
    const welcomeMsg: Message = {
      id: generateUUID(),
      role: 'assistant',
      content: `Hello ${visitorInfo?.name || ''} 👋\n\nI'm the RAGX Knowledge Assistant. New chat started. How can I help you?`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMsg]);
    setShowHistory(false);
  };
  
  const loadHistoryChat = (convoId: string) => {
    const chat = history.find(h => h.id === convoId);
    if (chat) {
      setConversationId(convoId);
      setMessages(chat.messages);
      setShowHistory(false);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 z-[90] ${
          isOpen 
            ? 'bg-elevated/80 backdrop-blur-md border border-border-default text-primary rotate-90 scale-0 opacity-0 pointer-events-none' 
            : 'bg-elevated/80 backdrop-blur-md border border-border-default text-accent hover:bg-accent hover:text-white hover:scale-110 opacity-100 scale-100'
        }`}
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
            <div className="fixed inset-0 z-[9999] pointer-events-none font-sans flex items-end sm:items-end justify-end sm:p-6 pb-0 pr-0">
              {/* Mobile Backdrop Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9995] sm:hidden pointer-events-auto"
              />
            
            <motion.div
              initial={{ opacity: 0, y: "100%", scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: "100%", scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100] flex flex-col bg-elevated/95 backdrop-blur-xl border border-border-default shadow-2xl overflow-hidden pointer-events-auto
                        h-[100dvh] w-full rounded-none sm:h-[700px] sm:w-[440px] sm:max-h-[calc(100vh-80px)] sm:rounded-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border-default bg-base shrink-0">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl leading-none">🧠</span>
                    <span className="font-bold text-primary text-base">Knowledge Assistant</span>
                  </div>
                  <p className="text-xs text-secondary mt-1 max-w-[280px]">
                    Ask anything about our company, services, projects, or expertise.
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`p-2 rounded-full transition-colors ${showHistory ? 'text-accent bg-accent/10' : 'text-secondary hover:text-accent hover:bg-accent/10'}`}
                    aria-label="History"
                    title="History"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={clearConversation}
                    className="p-2 text-secondary hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
                    aria-label="New chat"
                    title="New chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-secondary hover:text-primary hover:bg-border-default rounded-full transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {!isIdentified ? (
                /* Welcome Screen */
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center bg-base">
                  <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">Welcome to RAGX</h3>
                  <p className="text-sm text-secondary mb-8 max-w-[280px]">
                    Before we begin, please introduce yourself. Your conversation will be securely saved for this session.
                  </p>
                  <form onSubmit={handleWelcomeSubmit} className="w-full space-y-4 max-w-xs">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        placeholder="Your Name" 
                        className="w-full pl-10 pr-4 py-3 bg-elevated border border-border-default rounded-xl text-sm focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="Your Email" 
                        className="w-full pl-10 pr-4 py-3 bg-elevated border border-border-default rounded-xl text-sm focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-accent text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-accent-hover active:scale-95 transition-all mt-2"
                    >
                      Start Conversation
                    </button>
                  </form>
                </div>
              ) : showHistory ? (
                /* History View */
                <div className="flex-1 overflow-y-auto p-4 bg-base flex flex-col space-y-2">
                  <h3 className="text-sm font-semibold text-primary mb-2 px-2">Chat History</h3>
                  {history.length === 0 ? (
                    <p className="text-sm text-secondary px-2">No previous conversations found.</p>
                  ) : (
                    history.map(h => (
                      <button
                        key={h.id}
                        onClick={() => loadHistoryChat(h.id)}
                        className={`text-left p-3 rounded-xl transition-colors ${h.id === conversationId ? 'bg-accent/10 border border-accent/20' : 'bg-elevated border border-border-default hover:bg-accent/5'}`}
                      >
                        <p className="text-sm font-medium text-primary line-clamp-1">{h.title || 'Conversation'}</p>
                        <p className="text-[11px] text-secondary mt-1">{formatTime(h.updatedAt)}</p>
                      </button>
                    ))
                  )}
                  <button
                    onClick={clearConversation}
                    className="mt-4 py-2 flex items-center justify-center gap-2 bg-accent/10 text-accent rounded-xl text-sm font-medium hover:bg-accent hover:text-white transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Start New Chat
                  </button>
                </div>
              ) : (
                /* Chat Interface */
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-base">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`flex items-center gap-2 mb-1.5 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {msg.role === 'assistant' && <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0"><Bot className="w-3.5 h-3.5 text-accent" /></div>}
                          {msg.role === 'user' && <div className="w-6 h-6 rounded-full bg-border-default flex items-center justify-center shrink-0"><User className="w-3.5 h-3.5 text-secondary" /></div>}
                          {msg.role === 'system' && <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0"><AlertCircle className="w-3.5 h-3.5 text-red-500" /></div>}
                          <span className="text-[11px] font-medium text-primary">
                            {msg.role === 'assistant' ? 'AI Assistant' : msg.role === 'system' ? 'System Notice' : 'You'}
                          </span>
                        </div>
                        
                        <div 
                          className={`max-w-[85%] p-3.5 rounded-2xl ${
                            msg.role === 'user' 
                              ? 'bg-accent text-white rounded-tr-sm shadow-sm' 
                              : msg.role === 'system'
                              ? 'bg-red-500/10 border border-red-500/20 text-red-500 rounded-tl-sm text-sm'
                              : 'bg-elevated border border-border-default text-primary rounded-tl-sm shadow-sm'
                          }`}
                        >
                          {msg.role === 'user' || msg.role === 'system' ? (
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          ) : (
                            msg.isStreaming ? (
                              <TypewriterText 
                                text={msg.content} 
                                onComplete={() => {
                                  setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isStreaming: false } : m));
                                }} 
                              />
                            ) : (
                              <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            )
                          )}
                        </div>
                        <span className="text-[10px] text-secondary mt-1 px-1">{formatTime(msg.timestamp)}</span>
                      </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-accent" />
                          </div>
                          <span className="text-[11px] font-medium text-primary">AI Assistant</span>
                        </div>
                        <div className="max-w-[80%] px-4 py-3.5 rounded-2xl bg-elevated border border-border-default rounded-tl-sm shadow-sm flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-elevated border-t border-border-default shrink-0 rounded-b-2xl">
                    <div className="relative flex items-end bg-base border border-border-default rounded-xl focus-within:ring-2 focus-within:ring-accent focus-within:border-transparent transition-all shadow-sm">
                      <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask the RAG engine..."
                        disabled={isLoading}
                        className="w-full max-h-[150px] py-3 pl-4 pr-12 bg-transparent text-sm resize-none focus:outline-none disabled:opacity-50 text-primary placeholder-secondary"
                        rows={1}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-accent text-white shadow-sm disabled:opacity-50 disabled:shadow-none hover:bg-accent-hover hover:shadow transition-all"
                        aria-label="Send message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-2 px-1">
                      <span className="text-[10px] text-secondary">Shift+Enter for newline</span>
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${engineStatus?.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-[10px] text-secondary">{engineStatus?.status === 'ONLINE' ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
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
