import { Metadata } from "next";
import { getPillars } from "@/lib/services";
import { ServicesClient } from "@/components/service/ServicesClient";

export const metadata: Metadata = {
  title: "Custom AI Call Agents, Chatbots, RAG & Workflow Automation",
  description: "Custom AI call agents, custom AI chatbots, RAG agents, and workflow automation for California and Florida companies. Voice, WhatsApp, LLM orchestration, and production backends.",
  keywords: [
    "custom AI call agents",
    "custom AI chatbots",
    "RAG agents",
    "workflow automation",
    "AI voice agents",
    "California",
    "Florida",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Custom AI Call Agents, Chatbots, RAG & Automation",
    description: "Production AI agents and workflow automation for California and Florida teams.",
    type: "website",
  }
};

export default function ServicesPage() {
  const pillars = getPillars();
  return <ServicesClient initialServices={pillars} />;
}
