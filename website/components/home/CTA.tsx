"use client";

import * as React from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/fx/Magnetic";
import { Reveal } from "@/components/fx/Reveal";

export function CTA() {
  return (
    <Section className="bg-base pb-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-elevated px-8 py-16 text-center md:p-24 hud-corners">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent_55%)]" />
            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
              <h2 className="mb-6 font-display text-4xl font-bold text-primary md:text-6xl">Need the system — or the engineer?</h2>
              <p className="mb-10 text-xl text-secondary">
                Freelance builds for California and Florida operators. Full-time senior AI roles on US teams. Same person either way.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Magnetic>
                  <Link
                    href="/contact?intent=freelance"
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-gold px-7 py-3 text-sm font-semibold text-[color:var(--color-bg-base)] shadow-[0_0_24px_color-mix(in_srgb,var(--color-gold)_35%,transparent)] transition-colors hover:bg-gold-hover sm:min-h-12 sm:text-base"
                  >
                    Hire for a project
                  </Link>
                </Magnetic>
                <Link
                  href="/hire"
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-accent/50 px-7 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/10 hover:border-accent sm:min-h-12 sm:text-base"
                >
                  See hiring options
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
