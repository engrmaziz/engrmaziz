"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const faqItems = [
  {
    id: "faq-1",
    title: "What technologies do you specialize in?",
    content: (
      <p>
        My primary specialization is AI/ML backend engineering: LangGraph-based multi-agent systems, Corrective RAG pipelines, and LLM Guardrail architectures. On the backend, Python/FastAPI and Node.js/Express are my production workhorses. For full-stack work, Next.js 14 with TypeScript is my standard. I have expert-level production experience with PostgreSQL, ChromaDB, Qdrant, and Supabase Vector.
      </p>
    ),
  },
  {
    id: "faq-2",
    title: "Are you available for freelance or contract work?",
    content: (
      <p>
        Yes. I take on select freelance and contract engagements, particularly for Enterprise AI implementations, RAG pipeline builds, and Full-Stack SaaS platforms. My preference is value-based pricing for defined deliverables, or retainer contracts for ongoing technical leadership. Reach out via the contact page with a brief description of the problem you need solved.
      </p>
    ),
  },
  {
    id: "faq-3",
    title: "What industries have you worked in?",
    content: (
      <p>
        Applied AI (Cygnus Technologies — ETL, RAG, MLOps), Healthcare (Allama Iqbal Hospital — Clinical AI, 1,000+ daily interactions), E-Commerce (NovaSole — 500k+ visitors), Renewable Energy (Ihsan Solar — NOC architecture), Telecommunications (Transworld Home — 50,000+ ISP connections), FinTech (AegisFlow — fraud detection), and Enterprise SaaS. I am comfortable in regulated, high-stakes environments.
      </p>
    ),
  },
  {
    id: "faq-4",
    title: "Can you build production-grade AI systems?",
    content: (
      <p>
        Yes — production in the strictest sense. At Allama Iqbal Hospital I designed and deployed an LLM-powered agent with a LangChain RAG pipeline on a multi-channel patient platform handling 1,000+ daily interactions, using OpenAI, Gemini, and Groq-hosted Llama 3.3 70B. At Cygnus Technologies I now design end-to-end AI/ML systems covering ETL, RAG, and MLOps. I do not build AI demos; I ship systems that handle real usage.
      </p>
    ),
  },
  {
    id: "faq-5",
    title: "Do you work remotely?",
    content: (
      <p>
        Yes. I operate as an Async-First remote worker, highly effective with international teams. My primary target market is the United States, and I am accustomed to overlapping EST/PST time zones. I am open to hybrid models or strategic relocation for the right enterprise opportunity, particularly in the US or GCC regions.
      </p>
    ),
  },
  {
    id: "faq-6",
    title: "Do you design system architecture, or only implement?",
    content: (
      <p>
        Both, but architecture is the primary value I deliver. I lead Discovery and Architecture Definition phases — whiteboarding business problems, auditing existing systems, and producing technical roadmaps (C4 diagrams, ADRs, API contracts) before implementation begins. Under my Technical Consulting service, I also provide architecture reviews and fractional CTO advisory independently of implementation work.
      </p>
    ),
  },
  {
    id: "faq-7",
    title: "How do you prevent AI hallucinations?",
    content: (
      <p>
        Corrective RAG (CRAG): a secondary LLM grades retrieved documents for relevance before generation. If documents fail the relevance check, a fallback search is triggered — the LLM never generates from irrelevant context. Additionally, I run DeepEval CI/CD pipelines testing against 500+ golden queries on every git push, blocking deployment if hallucination scores breach defined thresholds.
      </p>
    ),
  },
  {
    id: "faq-8",
    title: "What is your educational background?",
    content: (
      <p>
        I hold a B.S. (Hons.) in Electrical Engineering from COMSATS University Islamabad, Lahore Campus (Sep 2017 – Aug 2021) and am a Registered Electrical Engineer with the Pakistan Engineering Council (PEC, active since Sep 2021). My research on LoRaWAN Smart Agriculture was published in MDPI Sustainability (Impact Factor 3.125). This formal engineering foundation — systems thinking, hardware constraints, strict tolerances — directly shapes how I architect software.
      </p>
    ),
  },
  {
    id: "faq-9",
    title: "Can I hire you freelance and also consider you for a full-time role?",
    content: (
      <p>
        Yes. Freelance is the default for scoped California and Florida builds (call agents, chatbots, RAG, automation). Full-time is open for senior applied-AI roles on US teams, remote-first. Use the Hire page and pick an intent so the first reply is not a guessing game.
      </p>
    ),
  },
  {
    id: "faq-10",
    title: "Do you serve California and Florida without a US office?",
    content: (
      <p>
        Yes. I serve those states remotely. Schema and the location pages list California and Florida as area served and Lahore as home location. I will not invent a California or Florida street address to game Map Pack.
      </p>
    ),
  },
];

export function FAQ() {
  return (
    <Section className="bg-elevated py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-secondary max-w-2xl">
            Common questions from recruiters, founders, and engineering leads — answered directly.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl"
        >
          <Accordion items={faqItems} allowMultiple={false} />
        </motion.div>
      </Container>
    </Section>
  );
}
