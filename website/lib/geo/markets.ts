import type { GeoMarket } from "./types";

/**
 * Free keyword research (no paid APIs).
 * Clusters come from query intent, competitor SERPs in CA/FL, and the live /services catalog.
 *
 * Head terms (high competition, national):
 *   custom AI call agents, custom AI chatbots, RAG agents, workflow automation
 * Geo modifiers Google actually uses for service queries:
 *   "in California", "Los Angeles", "Bay Area", "San Diego"
 *   "in Florida", "Miami", "Tampa", "Orlando", "South Florida"
 * Adjacent terms from /services:
 *   AI voice agents, WhatsApp agents, Telegram agents, LLM orchestration,
 *   prompt engineering, Next.js, SaaS, backend engineering, architecture review
 *
 * Ranking #1 in Map Pack requires a real US Google Business Profile.
 * These pages target organic results for remote custom-build intent.
 */
export const MARKETS: Record<"california" | "florida", GeoMarket> = {
  california: {
    slug: "california",
    name: "California",
    abbreviation: "CA",
    timezone: "Pacific (PT)",
    overlap: "California mornings (7–10am PT) overlap evening working hours in Pakistan (PK UTC+5), which is the window used for live architecture reviews.",
    h1: "Custom AI Call Agents, Chatbots, RAG Agents & Workflow Automation in California",
    metaTitle: "Custom AI Call Agents, Chatbots & RAG in California",
    metaDescription:
      "Custom AI call agents, AI chatbots, RAG agents, and workflow automation for California companies. Remote production builds for LA, Bay Area, San Diego, and statewide teams.",
    intro: [
      "California teams do not need another chatbot template. They need production systems that answer phones, retrieve private documents without inventing facts, and wire those agents into the CRMs, EHRs, and billing tools already running the business. I build custom AI call agents, custom AI chatbots, RAG agents, and workflow automation for California operators who have already outgrown Zapier zaps and off-the-shelf voice bots.",
      "The demand is concentrated where labor is expensive and volume is unforgiving: Bay Area SaaS support orgs that cannot hire another 20 agents, Los Angeles clinics and agencies drowning in inbound calls, San Diego biotech and healthcare groups that cannot leak PHI into a public model, and Inland Empire / Long Beach logistics desks that live on the phone. Each of those problems maps to a different agent, not a single “AI assistant.”",
      "I work remotely from Lahore and deliver to California as a US-facing engineering practice—not a local storefront. There is no fake Irvine office on this site. What you get instead is a named engineer, production RAG and telephony work already shipped, and overlap hours for architecture calls. If you need a Map Pack pin on Wilshire Boulevard, that is a different vendor category. If you need a system that actually holds up in production, this is the page for that search.",
      "Every California engagement starts from the same four questions: which channel (voice, chat, WhatsApp, internal copilot), which source of truth (docs, CRM, EHR, tickets), which actions the agent is allowed to take, and which audit trail you need when something goes wrong. The pages linked below are written for those searches, not for generic “AI services.”",
    ],
    industries: [
      {
        name: "Bay Area / Silicon Valley SaaS",
        angle:
          "Support and sales orgs want RAG chatbots grounded in product docs, plus LLM orchestration that does not hallucinate plan limits or SSO setup steps.",
      },
      {
        name: "Los Angeles healthcare & dental",
        angle:
          "Inbound AI call agents for after-hours triage, insurance FAQs, and appointment routing without dumping PHI into a consumer chatbot.",
      },
      {
        name: "San Diego biotech & life sciences",
        angle:
          "Internal RAG agents over SOPs, batch records, and research wikis with permission-aware retrieval.",
      },
      {
        name: "Ports, 3PL, and field ops (LA/Long Beach, Inland Empire)",
        angle:
          "Outbound and inbound call agents for dispatch, plus workflow automation that updates TMS/CRM instead of leaving notes in Slack.",
      },
      {
        name: "Solar, energy, and field service",
        angle:
          "Workflow automation for lead-to-install handoffs, QA/NOC ticket routing, and voice follow-ups—work I have already run in production ops environments.",
      },
      {
        name: "Entertainment, agencies, and high-volume inbound",
        angle:
          "Custom AI chatbots and call agents that qualify, book, and escalate instead of dumping every inquiry on a coordinator.",
      },
    ],
    cities: ["los-angeles", "san-francisco", "san-diego", "sacramento", "orange-county"],
    searchIntents: [
      { query: "custom AI call agents California", intent: "Transactional — hire a builder", page: "/services/california/custom-ai-call-agents" },
      { query: "custom AI chatbots Los Angeles", intent: "Transactional + city", page: "/services/california/custom-ai-chatbots" },
      { query: "RAG agents Bay Area", intent: "Technical buyer", page: "/services/california/rag-agents" },
      { query: "workflow automation California", intent: "Ops / founder", page: "/services/california/workflow-automation" },
      { query: "AI voice agents San Diego", intent: "Telephony", page: "/services/california/voice-agents" },
      { query: "WhatsApp AI agent California", intent: "Messaging", page: "/services/california/whatsapp-agents" },
    ],
    faqs: [
      {
        q: "Can a remote engineer rank or serve California companies?",
        a: "Google ranks pages for relevance, not for a storefront photo. California buyers searching custom AI call agents or RAG agents are usually looking for a builder who has shipped production systems. I serve California remotely, publish unique location pages, and mark areaServed in schema. I do not invent a California street address.",
      },
      {
        q: "Do you work Pacific Time?",
        a: "Live calls sit in a California morning window (typically 7–10am PT), which is evening in Pakistan. Implementation is async-first: tickets, PRs, and eval reports, not eight hours of overlapping Slack.",
      },
      {
        q: "HIPAA and CCPA?",
        a: "RAG and call agents for California healthcare and consumer businesses are designed with least-privilege retrieval, no training on your corpus by default, and logging that your counsel can actually review. I am not a Covered Entity’s outsourced privacy office—legal review stays with you.",
      },
      {
        q: "Why not buy a hosted voice-agent SaaS?",
        a: "Hosted tools are fine until you need SIP concurrency, custom tool-calling into your stack, bilingual routing, or RAG that respects document ACLs. That is when California teams search for custom AI call agents instead of another monthly seat.",
      },
    ],
  },
  florida: {
    slug: "florida",
    name: "Florida",
    abbreviation: "FL",
    timezone: "Eastern (ET)",
    overlap: "Florida mornings (8–11am ET) overlap late evening in Pakistan, used for live discovery. Hurricane-season ops and bilingual (EN/ES) routing are first-class requirements, not add-ons.",
    h1: "Custom AI Call Agents, Chatbots, RAG Agents & Workflow Automation in Florida",
    metaTitle: "Custom AI Call Agents, Chatbots & RAG in Florida",
    metaDescription:
      "Custom AI call agents, AI chatbots, RAG agents, and workflow automation for Florida companies. Remote production builds for Miami, Tampa, Orlando, Jacksonville, and statewide teams.",
    intro: [
      "Florida search demand for custom AI call agents and chatbots is not the same as California’s. Miami operators need English/Spanish voice and WhatsApp. Orlando hospitality lives on after-hours booking. Tampa and Jacksonville healthcare and home-services companies need phones answered during storms, not a chatbot that says “try again tomorrow.” I build those systems as custom production software, not as a white-label reseller page.",
      "Local Florida agencies already sell “100 AI agents” and two-week voice bots. This site is for the buyer who already tried that and hit a wall: the agent cannot see the CRM, hallucinates insurance benefits, cannot speak Spanish on the same number, or dies when call volume spikes. Custom AI call agents, RAG agents, and workflow automation are how you get past that wall.",
      "I am not headquartered in Miami or Orlando. I deliver remotely to Florida with Eastern Time overlap for architecture calls. Schema on these pages lists Florida as an area served. It does not list a fabricated Brickell address. If your RFP requires a Florida LLC and a local office lease, I am the wrong vendor. If your RFP requires a working inbound line, a grounded knowledge base, and automations that write back to HubSpot or your PMS, keep reading.",
      "The service map below matches the catalog on /services: call agents, voice agents, chatbots, WhatsApp and Telegram agents, RAG development, LLM orchestration, prompt engineering, workflow automation, and the software-engineering work those agents sit on.",
    ],
    industries: [
      {
        name: "Miami / South Florida bilingual ops",
        angle:
          "Inbound AI call agents and WhatsApp agents that switch EN/ES, qualify, and book without dropping the Spanish-speaking caller into English IVR hell.",
      },
      {
        name: "Hospitality and tourism (Orlando, Miami Beach, Tampa)",
        angle:
          "After-hours booking chatbots and call agents tied to PMS/CRM, not a generic FAQ widget.",
      },
      {
        name: "Healthcare, dental, and senior care",
        angle:
          "Triage, refill, and scheduling agents with RAG over clinic policies—not a public ChatGPT window.",
      },
      {
        name: "Home services (HVAC, plumbing, roofing, restoration)",
        angle:
          "The highest-intent Florida voice-agent searches. Custom call agents that book jobs, capture photos via SMS, and write to the dispatch board.",
      },
      {
        name: "Insurance and disaster response",
        angle:
          "Workflow automation and RAG agents for FNOL intake, document collection, and status updates when claim volume explodes after a storm.",
      },
      {
        name: "Logistics (Miami, Jacksonville) and real estate",
        angle:
          "Call and chat qualification plus back-office automation so coordinators stop copy-pasting between portals.",
      },
    ],
    cities: ["miami", "tampa", "orlando", "jacksonville", "fort-lauderdale"],
    searchIntents: [
      { query: "custom AI call agents Florida", intent: "Transactional — hire a builder", page: "/services/florida/custom-ai-call-agents" },
      { query: "custom AI chatbots Miami", intent: "Transactional + city", page: "/services/florida/custom-ai-chatbots" },
      { query: "RAG agents Florida", intent: "Technical buyer", page: "/services/florida/rag-agents" },
      { query: "workflow automation Florida", intent: "Ops / founder", page: "/services/florida/workflow-automation" },
      { query: "AI voice agent HVAC Florida", intent: "Home services", page: "/services/florida/voice-agents" },
      { query: "WhatsApp AI agent Miami", intent: "Bilingual messaging", page: "/services/florida/whatsapp-agents" },
    ],
    faqs: [
      {
        q: "Do you support Spanish-language call agents?",
        a: "Yes. Florida pages treat bilingual routing as a default design constraint for Miami and South Florida, not a plugin. Voice, chat, and WhatsApp agents can share one knowledge base with language-specific prompts and handoff rules.",
      },
      {
        q: "Can agents stay up during hurricane season?",
        a: "The agent is only as available as the telephony, DNS, and cloud region you choose. I design for failover, queueing, and human overflow. I do not pretend a voice bot replaces a generator at a flooded clinic.",
      },
      {
        q: "Eastern Time overlap?",
        a: "Discovery and architecture sit in Florida morning hours (typically 8–11am ET). Build work is async. You will not get a fake “we’re in Fort Lauderdale” status message.",
      },
      {
        q: "How is this different from Orlando AI-automation shops?",
        a: "Those shops package seats and managed agents. I engineer custom call agents, RAG pipelines, and workflow automation against your APIs. Different job, different search intent, different page.",
      },
    ],
  },
};
