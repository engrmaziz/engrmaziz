"use client";

import { Accordion } from "@/components/ui/Accordion";
import type { GeoFaq } from "@/lib/geo/types";

export function GeoFaqList({ faqs }: { faqs: GeoFaq[] }) {
  return (
    <Accordion
      allowMultiple
      items={faqs.map((faq, index) => ({
        id: `faq-${index}`,
        title: faq.q,
        content: faq.a,
      }))}
    />
  );
}
