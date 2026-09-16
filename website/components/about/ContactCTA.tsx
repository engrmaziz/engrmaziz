"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ResumeDownload } from "@/components/ui/ResumeDownload";
import { Magnetic } from "@/components/fx/Magnetic";
import { Reveal } from "@/components/fx/Reveal";

export function ContactCTA() {
  return (
    <Section className="bg-base pb-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-elevated p-10 shadow-lg md:p-20 hud-corners">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <h2 className="font-display text-4xl font-bold leading-tight text-primary md:text-5xl">
                Ready to build something that works in production?
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-secondary">
                Whether you need a production RAG system, a scalable SaaS backend, a real-time voice AI pipeline, or a technical architecture review — the conversation starts here.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <ResumeDownload />
                <Magnetic>
                  <Link href="/contact">
                    <Button size="lg" className="gap-2 px-8 font-bold">
                      Start a Conversation <MessageCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
