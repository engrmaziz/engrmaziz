"use client";

import * as React from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ConstellationField } from "@/components/fx/ConstellationField";
import { Meteors } from "@/components/fx/Meteors";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  children: React.ReactNode;
  className?: string;
  meteors?: number;
};

export function PageHero({ children, className, meteors = 12 }: PageHeroProps) {
  return (
    <Section withContainer={false} className={cn("relative overflow-hidden bg-base", className)}>
      <ConstellationField className="opacity-85" />
      <Meteors count={meteors} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-base/30 via-transparent to-base"
      />
      <Container className="relative z-10">{children}</Container>
    </Section>
  );
}
