/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, RefreshCcw, Copy, ExternalLink, Bot, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Minimal types for UI prototype
interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  isStreaming?: boolean;
  citations?: { title: string; url: string }[];
}

const SUGGESTED_QUESTIONS = [
  "What backend technologies does he specialize in?",
  "Explain his RAG experience.",
  "Which industries has he worked in?",
  "Show certifications."
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello. I am the technical assistant for this portfolio. I am powered by a Retrieval-Augmented Generation (RAG) architecture indexing the entire knowledge base. How can I help you evaluate this profile?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add User Message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: text.trim() }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate Network/LLM delay
    setTimeout(() => {
      setIsTyping(false);
      const assistantMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { 
        id: assistantMsgId, 
        role: 'assistant', 
        content: "This is a simulated response. In production, this UI will stream tokens from the RAG backend, retrieving context from `workspace/knowledge-base/` to answer queries deterministically.",
        citations: [
          { title: "Architecture Philosophy", url: "/blog/architecture" },
          { title: "Enterprise AI Solutions", url: "/services/ai-solutions" }
        ]
      }]);
    }, 1500);
  };

  const clearConversation = () => {
    setMessages([messages[0]]);
  };

  const copyResponse = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <>
      {/* Floating Launcher */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-accent text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all z-50 focus:outline-none focus:ring-4 focus:ring-accent/30 group"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-base animate-pulse"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expandable Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-[calc(100vw-48px)] md:w-[450px] h-[600px] max-h-[calc(100vh-100px)] bg-base border border-border-default rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border-default bg-elevated flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    Knowledge Assistant
                    <span className="px-1.5 py-0.5 rounded-sm bg-accent/10 text-accent text-[10px] font-mono font-bold uppercase tracking-wider">Beta</span>
                  </h3>
                  <p className="text-xs text-secondary flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearConversation}
                  className="p-2 text-secondary hover:text-primary hover:bg-base rounded-md transition-colors"
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-secondary hover:text-primary hover:bg-base rounded-md transition-colors"
                  aria-label="Close assistant"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-base/50 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col gap-2 max-w-[85%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                  <div className="flex items-center gap-2 px-1">
                    {msg.role === 'assistant' ? (
                       <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Assistant</span>
                    ) : (
                       <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">You</span>
                    )}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-accent text-white rounded-tr-sm" 
                      : "bg-elevated border border-border-default text-primary rounded-tl-sm"
                  )}>
                    {msg.content}
                  </div>
                  
                  {/* Actions / Citations for Assistant Messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex flex-col gap-2 mt-1 w-full">
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cite, i) => (
                            <Link key={i} href={cite.url} className="px-2.5 py-1.5 bg-elevated border border-border-default rounded-lg text-xs text-secondary hover:text-accent hover:border-accent/30 transition-colors flex items-center gap-1.5 group">
                              <ExternalLink className="w-3 h-3 group-hover:text-accent" />
                              {cite.title}
                            </Link>
                          ))}
                        </div>
                      )}
                      {msg.id !== '1' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => copyResponse(msg.content)} className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1">
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex flex-col gap-2 max-w-[85%] mr-auto items-start">
                  <div className="p-4 bg-elevated border border-border-default rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border-default bg-base shrink-0">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(q)}
                      className="text-xs text-left px-3 py-2 bg-elevated border border-border-default rounded-lg text-secondary hover:text-primary hover:border-accent/40 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="relative flex items-center bg-elevated border border-border-default rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent focus-within:border-transparent transition-all">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  placeholder="Ask about my engineering experience..."
                  className="w-full bg-transparent px-4 py-3.5 text-sm text-primary focus:outline-none"
                />
                <button 
                  onClick={() => handleSend(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mt-3">
                 <span className="text-[10px] text-secondary/70 uppercase tracking-wider font-mono">Powered by Future RAG Integration</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
