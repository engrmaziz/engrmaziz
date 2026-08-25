import { Metadata } from "next";
import { ContactClient } from "@/components/contact/ContactClient";
import { siteMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact | Custom AI Call Agents, Chatbots & RAG",
  description: "Hire custom AI call agents, chatbots, RAG agents, and workflow automation for California and Florida companies. Remote technical consultation.",
  keywords: ["hire AI engineer", "freelance AI engineer", "custom AI call agents", "custom AI chatbots", "RAG agents", "workflow automation", "California", "Florida"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Senior AI Engineer",
    description: "Available for custom AI agents and automation for California and Florida teams.",
    type: "website",
  }
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Senior AI Engineer",
    "description": "Contact for technical consulting, backend architecture, and AI integration.",
    "mainEntity": {
      "@type": "Person",
      "name": "Musharraf Aziz",
      "jobTitle": "Senior AI Engineer",
      "url": siteMetadata.siteUrl,
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
