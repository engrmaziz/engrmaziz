"use client";

import * as React from "react";
import { useInView } from "framer-motion";
import { Marquee } from "@/components/ui/Marquee";

function Counter({ from, to, suffix = "", duration = 1.6 }: { from: number; to: number; suffix?: string; duration?: number }) {
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  React.useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | undefined;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (to - from) + from);
      if (nodeRef.current) nodeRef.current.textContent = `${currentCount}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(step);
      else if (nodeRef.current) nodeRef.current.textContent = `${to}${suffix}`;
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration, suffix]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
}

const METRICS = [
  { to: 6, suffix: "+", label: "Years shipping" },
  { to: 40, suffix: "+", label: "Production systems" },
  { to: 99, suffix: ".9%", label: "Uptime delivered" },
  { to: 15, suffix: "+", label: "Stacks in production" },
];

const SIGNAL = ["LangGraph", "FastAPI", "pgvector", "Twilio", "Next.js", "Groq", "PostgreSQL", "Kubernetes", "Redis", "LlamaIndex"];

export function TrustStrip() {
  return (
    <section className="border-y border-border-default bg-elevated/40">
      <div className="grid grid-cols-2 divide-x divide-border-default md:grid-cols-4">
        {METRICS.map((metric) => (
          <div key={metric.label} className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <span className="mb-2 font-display text-4xl font-bold text-primary md:text-5xl">
              <Counter from={0} to={metric.to} suffix={metric.suffix} />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">{metric.label}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border-default py-4">
        <Marquee>
          {SIGNAL.map((item) => (
            <span key={item} className="font-mono text-xs uppercase tracking-[0.24em] text-secondary">
              {item} <span className="mx-5 text-accent">/</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
