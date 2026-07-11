"use client";

import * as React from "react";
import { Mail, MapPin, Clock, Code, Briefcase, FileText, CalendarCheck, ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/contact/ContactForm";
import { AIAssistant } from "@/components/assistant/AIAssistant";
import { SplitLayout } from "@/components/layout/SplitLayout";

export function ContactClient() {
  return (
    <>
      <Section className="pt-24 pb-12 bg-base border-b border-border-default">
        <Container>
          <div className="max-w-4xl">
            <Badge variant="outline" className="mb-4">Engagement & Inquiry</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              Let&apos;s architect <br/> something robust.
            </h1>
            <p className="text-xl text-secondary leading-relaxed max-w-3xl">
              Currently accepting inquiries for high-complexity AI integration, deterministic RAG architecture, and scalable backend engineering projects.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-base relative overflow-hidden">
        <Container>
          <SplitLayout
            ratio="1/3-2/3"
            className="items-start gap-12 lg:gap-24"
            left={
              <div className="space-y-12">
                {/* Availability */}
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-border-default pb-4">Status</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-bold text-primary">Accepting New Projects</span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">
                    Available for contract, consulting, and select full-time enterprise opportunities starting next month.
                  </p>
                </div>

                {/* Direct Contact */}
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-border-default pb-4">Direct Details</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-elevated border border-border-default flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Email</div>
                        <a href="mailto:hello@example.com" className="text-sm font-medium text-primary hover:text-accent transition-colors">hello@example.com</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-elevated border border-border-default flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Location</div>
                        <div className="text-sm font-medium text-primary">Global / Remote</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-elevated border border-border-default flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Response Time</div>
                        <div className="text-sm font-medium text-primary">&lt; 24 Hours (Business Days)</div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Socials & Assets */}
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 border-b border-border-default pb-4">Digital Presence</h3>
                  <div className="flex flex-col gap-3">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-border-default bg-elevated hover:border-accent/40 hover:bg-accent/5 transition-all group">
                      <Code className="w-5 h-5 text-secondary group-hover:text-accent" />
                      <span className="text-sm font-bold text-primary group-hover:text-accent">GitHub Profile</span>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-border-default bg-elevated hover:border-accent/40 hover:bg-accent/5 transition-all group">
                      <Briefcase className="w-5 h-5 text-secondary group-hover:text-accent" />
                      <span className="text-sm font-bold text-primary group-hover:text-accent">LinkedIn Network</span>
                    </a>
                    <a href="/resume.pdf" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-border-default bg-elevated hover:border-accent/40 hover:bg-accent/5 transition-all group">
                      <FileText className="w-5 h-5 text-secondary group-hover:text-accent" />
                      <span className="text-sm font-bold text-primary group-hover:text-accent">Download Resume</span>
                    </a>
                  </div>
                </div>
              </div>
            }
            right={
              <div className="bg-elevated p-8 md:p-12 rounded-2xl border border-border-default shadow-sm relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <ShieldCheck className="w-32 h-32" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">Project Inquiry</h2>
                <p className="text-sm text-secondary mb-10 max-w-md">
                  Please provide context regarding your architectural challenges, stack constraints, and timeline goals.
                </p>
                <ContactForm />
              </div>
            }
          />
        </Container>
      </Section>

      <Section className="bg-primary text-[color:var(--color-bg-base)] py-20 border-t border-border-default">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <CalendarCheck className="w-6 h-6 text-accent" />
                Prefer a synchronous meeting?
              </h3>
              <p className="text-[color:var(--color-bg-base)] opacity-80 leading-relaxed">
                If you require an immediate technical consultation or architecture review, we can schedule a secure video conference.
              </p>
            </div>
            <button className="px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors shrink-0">
              Request Calendar Invite
            </button>
          </div>
        </Container>
      </Section>

      {/* Inject the global AI Assistant launcher on this page */}
      <AIAssistant />
    </>
  );
}
