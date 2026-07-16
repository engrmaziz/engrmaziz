"use client";

import * as React from "react";
import { useInView } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

function Counter({ from, to, suffix = "", duration = 2 }: { from: number; to: number; suffix?: string; duration?: number }) {
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  React.useEffect(() => {
    if (!inView) return;
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (to - from) + from);
      if (nodeRef.current) {
        nodeRef.current.textContent = `${currentCount}${suffix}`;
      }
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else if (nodeRef.current) {
        nodeRef.current.textContent = `${to}${suffix}`;
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration, suffix]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
}

export function TrustStrip() {
  return (
    <Section className="border-y border-border-default bg-elevated/50">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border-default">
          <div className="flex flex-col items-center justify-center text-center px-4">
            <span className="text-4xl font-bold text-primary font-mono mb-2">
              <Counter from={0} to={6} suffix="+" />
            </span>
            <span className="text-sm font-medium text-secondary tracking-wide uppercase">Years Experience</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-4">
            <span className="text-4xl font-bold text-primary font-mono mb-2">
              <Counter from={0} to={40} suffix="+" />
            </span>
            <span className="text-sm font-medium text-secondary tracking-wide uppercase">Projects Shipped</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-4">
            <span className="text-4xl font-bold text-primary font-mono mb-2">
              <Counter from={0} to={99} suffix=".9%" />
            </span>
            <span className="text-sm font-medium text-secondary tracking-wide uppercase">Uptime Delivered</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-4">
            <span className="text-4xl font-bold text-primary font-mono mb-2">
              <Counter from={0} to={15} suffix="+" />
            </span>
            <span className="text-sm font-medium text-secondary tracking-wide uppercase">Tech Stacks</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
