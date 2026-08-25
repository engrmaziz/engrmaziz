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
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[color:var(--color-bg-base)]">Need the system — or the engineer?</h2>
            <p className="text-xl text-[color:var(--color-bg-base)] opacity-80 mb-10">
              Freelance builds for California and Florida operators. Full-time senior AI roles on US teams. Same person either way.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact?intent=freelance">
                <Button size="lg" variant="secondary" className="text-primary bg-[color:var(--color-bg-base)] hover:opacity-90 border-none h-14 px-8 text-lg font-bold">
                  Hire for a project
                </Button>
              </Link>
              <Link href="/hire">
                <Button size="lg" variant="outline" className="border-[color:var(--color-bg-base)]/30 text-[color:var(--color-bg-base)] hover:bg-[color:var(--color-bg-base)]/10 h-14 px-8 text-lg">
                  See hiring options
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
