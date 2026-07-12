import { Metadata } from "next";
import { ContactClient } from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact & Technical Inquiry",
  description: "Reach out for enterprise AI architecture, high-concurrency backend development, and scalable software solutions.",
  openGraph: {
    title: "Contact | Senior Software Architect",
    description: "Available for contract, consulting, and select full-time enterprise opportunities.",
    type: "website",
  }
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Senior Software Architect",
    "description": "Contact for technical consulting, backend architecture, and AI integration.",
    "mainEntity": {
      "@type": "Person",
      "name": "Musharraf Aziz",
      "jobTitle": "Senior Software Architect",
      "url": "https://maziz.me",
      "sameAs": [
        "https://github.com/engrmaziz",
        "https://linkedin.com/in/musharrafazizq"
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient />
    </>
  );
}
