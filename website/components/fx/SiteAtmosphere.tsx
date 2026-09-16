"use client";

import * as React from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function SiteAtmosphere() {
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    const onMove = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <>
      <div aria-hidden className="site-aurora pointer-events-none fixed inset-0 z-[1]" />
      {!reduced ? <div aria-hidden className="site-spotlight pointer-events-none fixed inset-0 z-[2]" /> : null}
      <div aria-hidden className="site-grain pointer-events-none fixed inset-0 z-[3]" />
    </>
  );
}
