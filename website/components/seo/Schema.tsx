import * as React from "react";
import Script from "next/script";

type SchemaType = "Article" | "Person" | "WebSite" | "Organization" | "Service" | "FAQPage" | "Project";

export interface SchemaProps {
  type: SchemaType;
  data: Record<string, unknown>;
}

export function Schema({ type, data }: SchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <Script
      id={`schema-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
