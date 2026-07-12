"use client";

import * as React from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <Section className="bg-base pb-32">
      <Container>
        <div className="bg-primary text-[color:var(--color-bg-base)] rounded-2xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent z-0 opacity-50 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[color:var(--color-bg-base)]">Ready to scale your architecture?</h2>
            <p className="text-xl text-[color:var(--color-bg-base)] opacity-80 mb-10">
              Whether you need a fault-tolerant backend, a production-ready RAG pipeline, or a complete technical overhaul, let&apos;s discuss how we can build it right.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="text-primary bg-[color:var(--color-bg-base)] hover:opacity-90 border-none h-14 px-8 text-lg font-bold">
                  Schedule a Consultation
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-[color:var(--color-bg-base)]/30 text-[color:var(--color-bg-base)] hover:bg-[color:var(--color-bg-base)]/10 h-14 px-8 text-lg">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
