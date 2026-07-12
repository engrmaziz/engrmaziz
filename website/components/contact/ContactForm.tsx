/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API integration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-2">Message Received</h3>
        <p className="text-secondary leading-relaxed mb-6">
          Thank you for reaching out. I typically respond to engineering inquiries within 24 hours.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-sm font-bold text-accent hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-primary">Full Name <span className="text-red-500">*</span></label>
          <input required disabled={isSubmitting} type="text" id="name" className="w-full bg-base border border-border-default rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50" placeholder="Jane Doe" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-primary">Work Email <span className="text-red-500">*</span></label>
          <input required disabled={isSubmitting} type="email" id="email" className="w-full bg-base border border-border-default rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50" placeholder="jane@company.com" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-primary">Company</label>
          <input disabled={isSubmitting} type="text" id="company" className="w-full bg-base border border-border-default rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50" placeholder="Acme Corp" />
        </div>
        <div className="space-y-2">
          <label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-primary">Role</label>
          <input disabled={isSubmitting} type="text" id="role" className="w-full bg-base border border-border-default rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50" placeholder="VP of Engineering" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-primary">Project Type</label>
          <select disabled={isSubmitting} id="type" className="w-full bg-base border border-border-default rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none disabled:opacity-50">
            <option value="">Select an option</option>
            <option value="ai">AI / RAG Architecture</option>
            <option value="backend">Backend Systems Scaling</option>
            <option value="fullstack">Full-Stack Development</option>
            <option value="consulting">Technical Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="timeline" className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            Preferred Meeting Time
            <span className="text-[10px] text-secondary font-medium tracking-normal bg-elevated border border-border-default px-1.5 py-0.5 rounded ml-auto">US EST (Washington)</span>
          </label>
          <input disabled={isSubmitting} type="datetime-local" id="timeline" className="w-full bg-base border border-border-default rounded-lg px-4 py-[11px] text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-primary">Message <span className="text-red-500">*</span></label>
        <textarea required disabled={isSubmitting} id="message" rows={5} className="w-full bg-base border border-border-default rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-y disabled:opacity-50" placeholder="Describe your architecture challenges, goals, and technical requirements..." />
      </div>

      <div className="flex items-start gap-3 pt-2">
        <div className="flex items-center h-5">
          <input disabled={isSubmitting} id="consent" type="checkbox" required className="w-4 h-4 border-border-default rounded bg-base text-accent focus:ring-accent disabled:opacity-50" />
        </div>
        <label htmlFor="consent" className="text-xs text-secondary leading-relaxed">
          I consent to having this website store my submitted information so they can respond to my inquiry. I understand this data will not be shared with third parties.
        </label>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-3.5 bg-primary text-[color:var(--color-bg-base)] font-bold rounded-lg hover:bg-accent transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Transmitting
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Send Secure Message
          </>
        )}
      </button>
    </form>
  );
}
