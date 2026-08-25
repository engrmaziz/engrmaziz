import type { GeoServiceDef } from "./types";

export const GEO_SERVICES: GeoServiceDef[] = [
  {
    slug: "custom-ai-call-agents",
    canonicalPath: "/services/ai-agents/ai-call-agents",
    primaryKeyword: "custom AI call agents",
    secondaryKeywords: [
      "AI call agents California",
      "AI call agents Florida",
      "AI phone agent",
      "inbound AI call center",
      "outbound AI calling",
      "Twilio AI agent",
    ],
    category: "AI Agents",
    shortName: "Custom AI Call Agents",
    summary:
      "Inbound and outbound AI call agents on your numbers, with tool-calling into CRM/PMS, queues, and human overflow—not a hosted receptionist with no memory.",
    california: {
      h1: "Custom AI Call Agents in California",
      metaTitle: "Custom AI Call Agents in California | Inbound & Outbound",
      metaDescription:
        "Custom AI call agents for California clinics, SaaS, and operators. Inbound triage, outbound follow-up, SIP concurrency, and CRM write-back. Remote production builds.",
      intro: [
        "California companies searching for custom AI call agents are usually past the demo. The hosted receptionist cannot see Dentrix or Salesforce, cannot run  a Saturday overflow queue for three LA locations, and cannot stay on-script for insurance FAQs. Custom means the agent is software you own: prompts, tools, telephony, evals, and the handoff rules.",
        "I build high-concurrency inbound and outbound call agents for California operators—clinics in Los Angeles and Orange County, support lines for Bay Area SaaS, dispatch desks near the ports, and field-service companies that live on missed-call revenue. The national service page covers the architecture. This page is the California intent: PT overlap, CCPA-aware logging, and multi-location routing.",
        "If you wanted a Map Pack listing for “AI call center near me,” you need a California office and Google Business Profile. If you wanted someone who has actually built telephony agents and ops systems, you are in the right place.",
      ],
      problems: [
        "After-hours and lunch-hour missed calls in multi-location LA and OC medical groups.",
        "Bay Area support phones that still dump every caller into a tier-1 queue the chatbot already could have solved.",
        "Outbound follow-up that dies in a dialer with no CRM context.",
        "Agents that hallucinate benefits, hours, or pricing because there is no RAG layer.",
      ],
      useCases: [
        { title: "LA / OC clinic triage", body: "Inbound AI call agents that identify new vs existing patients, collect insurance snapshots, and book against real provider calendars." },
        { title: "Bay Area SaaS + phone sales", body: "Qualification and routing into AE calendars with CRM notes, not a voicemail graveyard." },
        { title: "Port and 3PL dispatch", body: "Inbound status and outbound driver/broker calls with write-back to the TMS." },
        { title: "Solar / field ops follow-up", body: "Outbound AI calling on stalled leads and QA tickets, using workflows I have already run in energy ops." },
      ],
      deliveryNote:
        "Live call reviews 7–10am PT. Load tests and prompt evals ship async. California numbers and SIP trunks stay in your account unless you ask otherwise.",
      faqs: [
        { q: "Twilio, SIP, or a voice-agent SaaS?", a: "Whatever your concurrency and compliance need. Custom AI call agents often sit on Twilio or SIP plus an orchestration layer so you are not trapped in one vendor’s prompt box." },
        { q: "Can it dial California numbers at scale?", a: "Outbound is a compliance problem (TCPA, consent, time-of-day) as much as an engineering one. We design the dialer; you own the list and the legal basis." },
        { q: "What about recordings?", a: "Recording, redaction, and retention follow your policy. California two-party consent is a product requirement, not a footnote." },
      ],
    },
    florida: {
      h1: "Custom AI Call Agents in Florida",
      metaTitle: "Custom AI Call Agents in Florida | Bilingual Voice",
      metaDescription:
        "Custom AI call agents for Florida businesses. Bilingual EN/ES inbound, HVAC and clinic booking, hospitality overflow, CRM write-back. Remote production engineering.",
      intro: [
        "Florida searches for custom AI call agents are dominated by home services, clinics, and hospitality—plus Miami operators who need Spanish on the same line. A California English-only bot is the wrong artifact. Custom here means language routing, storm overflow, and write-back to ServiceTitan, Housecall Pro, or the PMS you already run.",
        "I build those agents remotely for Miami, Tampa, Orlando, Jacksonville, and statewide teams. Local Florida shops sell packaged voice agents. This page is for the buyer whose package could not see the job board or dropped every Spanish caller.",
      ],
      problems: [
        "HVAC and restoration companies losing jobs to whoever answers first.",
        "Miami callers hitting English-only IVRs.",
        "Orlando hospitality overflow during peak season.",
        "Clinics whose after-hours vendor reads a script and cannot schedule.",
      ],
      useCases: [
        { title: "South Florida bilingual inbound", body: "One number, EN/ES detection, shared RAG, human overflow to the right-language staff." },
        { title: "Tampa Bay home services", body: "Book the job, capture the issue, SMS the dispatch link, write to the field app." },
        { title: "Orlando hotel / rental overflow", body: "After-hours booking against real availability, not a “leave a message.”" },
        { title: "Jacksonville logistics status", body: "Inbound tracking and exception calls that update the TMS instead of a shared inbox." },
      ],
      deliveryNote:
        "Architecture calls 8–11am ET. Bilingual eval sets are part of Miami/South Florida scopes unless you opt out.",
      faqs: [
        { q: "Spanish quality?", a: "We eval Spanish separately. “The model speaks Spanish” is not an acceptance test." },
        { q: "Hurricane week volume?", a: "Queueing, voicemail fallback, and human overflow are designed in. The cloud region will not survive your local power outage—plan the IVR message for that." },
        { q: "TCPA for Florida outbound?", a: "Same rule as everywhere: you own consent. I own the dialer architecture." },
      ],
    },
  },
  {
    slug: "custom-ai-chatbots",
    canonicalPath: "/services/ai-agents/chatbots",
    primaryKeyword: "custom AI chatbots",
    secondaryKeywords: [
      "AI chatbot development",
      "custom chatbot California",
      "custom chatbot Florida",
      "RAG chatbot",
      "enterprise AI chatbot",
    ],
    category: "AI Agents",
    shortName: "Custom AI Chatbots",
    summary:
      "Website, in-app, and support chatbots with streaming, RAG, and actions—not a ChatGPT embed on your contact page.",
    california: {
      h1: "Custom AI Chatbots in California",
      metaTitle: "Custom AI Chatbots in California | RAG Support Bots",
      metaDescription:
        "Custom AI chatbots for California SaaS, healthcare, and operators. RAG-grounded answers, ticket actions, and Next.js streaming UIs. Remote production builds.",
      intro: [
        "Custom AI chatbots in California are a Bay Area and LA problem more than a novelty widget problem. SaaS teams need in-app bots that cite product docs. Clinics need web chat that books and does not invent copays. Agencies need lead bots that write to the CRM.",
        "I engineer those chatbots as production software: Server-Sent Events, RAG, tool-calling, and evals. The national chatbot page is the capability catalog. This page is California search intent—CCPA, PT overlap, and the industries that actually pay for custom work.",
      ],
      problems: [
        "Docs chatbots that hallucinate pricing and SSO steps.",
        "Marketing chat widgets with no CRM write-back.",
        "Healthcare sites whose bot is a liability.",
        "Support tickets that a grounded bot could have closed.",
      ],
      useCases: [
        { title: "Bay Area product chatbot", body: "Permission-aware RAG over docs, status pages, and tickets with citations." },
        { title: "LA clinic web chat", body: "Hours, providers, and booking—no invented benefits." },
        { title: "OC multi-location bot", body: "Location detection and the right menu, not one Irvine FAQ for all offices." },
        { title: "Internal copilot", body: "Same stack, private corpus, SSO." },
      ],
      deliveryNote:
        "UI usually ships in Next.js to match how California product teams already deploy. PT morning reviews.",
      faqs: [
        { q: "Intercom / Zendesk vs custom?", a: "Keep the helpdesk. Custom AI chatbots sit in front of it with better retrieval and actions. I am not asking you to rip out Zendesk on day one." },
        { q: "Can it live on our Next.js site?", a: "Yes. That is a default path, not a constraint." },
      ],
    },
    florida: {
      h1: "Custom AI Chatbots in Florida",
      metaTitle: "Custom AI Chatbots in Florida | Miami & Statewide",
      metaDescription:
        "Custom AI chatbots for Florida hospitality, healthcare, and operators. Bilingual options, booking actions, RAG-grounded answers. Remote production engineering.",
      intro: [
        "Florida custom AI chatbot demand is booking and bilingual first, documentation second. Miami hotel and real-estate sites, Orlando vacation inventory, clinic chat that must not invent policy. I build those bots with RAG and real actions, not a bubble that says “thanks for reaching out.”",
      ],
      problems: [
        "Hospitality chat that cannot see availability.",
        "English-only bots on Miami sites.",
        "Lead forms that sales never reads.",
        "Clinic chat that answers medical questions it should not.",
      ],
      useCases: [
        { title: "Miami bilingual site chat", body: "EN/ES with the same booking tools and a language-matched handoff." },
        { title: "Orlando hotel / rental bot", body: "Inventory-aware answers and a bookable path." },
        { title: "Tampa clinic chatbot", body: "Scheduling and logistics only—no diagnosis theater." },
        { title: "Jacksonville operator FAQ", body: "RAG over rate cards and SOPs with citations." },
      ],
      deliveryNote:
        "ET morning reviews. Spanish copy and evals included for South Florida unless scoped out.",
      faqs: [
        { q: "WhatsApp vs web chat?", a: "Miami often needs both. They can share one agent core. See the WhatsApp page." },
        { q: "Can it upsell spa packages?", a: "It can follow your rate rules. It should not invent discounts." },
      ],
    },
  },
  {
    slug: "rag-agents",
    canonicalPath: "/services/ai-engineering/rag-development",
    primaryKeyword: "RAG agents",
    secondaryKeywords: [
      "RAG pipeline",
      "retrieval augmented generation",
      "enterprise RAG",
      "RAG development California",
      "RAG development Florida",
    ],
    category: "AI Engineering",
    shortName: "RAG Agents",
    summary:
      "Production retrieval-augmented generation: chunking, hybrid search, rerank, citations, evals, and agents that refuse when the corpus does not support the answer.",
    california: {
      h1: "RAG Agents in California",
      metaTitle: "RAG Agents in California | Production RAG Pipelines",
      metaDescription:
        "RAG agents and production retrieval pipelines for California SaaS, healthcare, and biotech. Hybrid search, citations, evals, ACL-aware retrieval. Remote engineering.",
      intro: [
        "“RAG agents” is the California technical search. Bay Area teams have already glued LlamaIndex to a vector DB and watched it fail on real tickets. What they want is hybrid retrieval, reranking, permission filters, and an agent that uses tools only when the corpus supports the step.",
        "I build those systems for California companies: product docs in SF, PHI-adjacent policies in San Diego and LA, and ops manuals for energy and logistics. The generic RAG service page is national. This page exists for California queries that include Bay Area, Los Angeles, and San Diego.",
      ],
      problems: [
        "Vector-only search that misses exact policy IDs and SKUs.",
        "No citations, so support cannot trust the bot.",
        "One index for every employee regardless of ACL.",
        "No eval set, so every prompt change is a vibe check.",
      ],
      useCases: [
        { title: "SaaS support RAG", body: "Docs + tickets + status, cited, permissioned by plan and role." },
        { title: "Healthcare policy agent", body: "Clinic SOPs in LA/SD with refusal when the answer is not in corpus." },
        { title: "Biotech internal wiki", body: "SOP retrieval that does not leak between projects." },
        { title: "Legal-adjacent contract Q&A", body: "Retrieval with provenance; lawyers stay in the loop." },
      ],
      deliveryNote:
        "Evals ship with the first production index. PT overlap for architecture. Customer VPC is common for Bay Area buyers.",
      faqs: [
        { q: "LangChain vs LlamaIndex vs custom?", a: "I pick the thinnest stack that passes evals. Framework religion is not a deliverable." },
        { q: "Where does data live?", a: "Your cloud by default for California healthcare and SaaS. I do not train foundation models on your corpus." },
      ],
    },
    florida: {
      h1: "RAG Agents in Florida",
      metaTitle: "RAG Agents in Florida | Grounded AI for Ops",
      metaDescription:
        "RAG agents for Florida healthcare, insurance, hospitality, and logistics. Cited answers, bilingual corpora, production retrieval—not a PDF dumped into ChatGPT.",
      intro: [
        "Florida RAG agent searches come from insurance, healthcare, and operators who got burned by a chatbot that invented coverage or hotel policy. The job is retrieval quality plus an agent that can take bounded actions (create a ticket, quote a documented rate), not a second brain.",
        "I build those pipelines for Miami, Tampa, Orlando, and Jacksonville teams, including bilingual corpora where South Florida needs both languages in one system.",
      ],
      problems: [
        "Chatbots inventing hurricane deductibles or clinic policy.",
        "English index, Spanish callers.",
        "Claims packets scattered across email and drives.",
        "Hospitality rate rules that change weekly with no retrieval.",
      ],
      useCases: [
        { title: "Insurance FNOL copilot", body: "Retrieve the right form and status; humans approve payouts." },
        { title: "Miami bilingual knowledge", body: "Parallel EN/ES chunks, one permission model." },
        { title: "Hospitality policy agent", body: "Cancellation and pet rules with citations to the current PDF." },
        { title: "Clinic SOP retrieval", body: "Staff-facing RAG, not a public medical oracle." },
      ],
      deliveryNote:
        "ET overlap. Storm-season document churn is a maintenance plan, not a one-off ingest.",
      faqs: [
        { q: "Can it read handwritten FNOL photos?", a: "OCR plus RAG is a scoped pipeline. Accuracy is measured, not promised at 100%." },
        { q: "SharePoint / Drive / S3?", a: "Connectors are part of the design. Garbage corpus in, garbage agent out—we audit that first." },
      ],
    },
  },
  {
    slug: "workflow-automation",
    canonicalPath: "/services/technical-consulting/workflow-automation",
    primaryKeyword: "workflow automation",
    secondaryKeywords: [
      "AI workflow automation",
      "business process automation",
      "n8n automation",
      "Zapier alternative",
      "LangGraph workflows",
    ],
    category: "Technical Consulting",
    shortName: "Workflow Automation",
    summary:
      "Custom Python, webhook, and agent workflows that connect CRMs, phones, and back-office systems—after the process is fixed, not before.",
    california: {
      h1: "Workflow Automation in California",
      metaTitle: "Workflow Automation in California | AI Ops Systems",
      metaDescription:
        "Workflow automation for California operators: CRM write-back, RAG-triggered actions, Python/LangGraph pipelines. Built for SaaS, clinics, solar, and logistics.",
      intro: [
        "Workflow automation is the California search used by ops leads who are tired of Zapier outages and brittle Make scenarios. The work is mapping the real process, deleting the stupid steps, then automating what is left—often with an AI call agent or RAG chatbot as a trigger, not as a replacement for the workflow.",
        "I design those systems for California teams: Bay Area product ops, LA clinic front desks, solar/field QA handoffs, and logistics. I have run operations and NOC workflows in production; this is not a student Zapier portfolio.",
      ],
      problems: [
        "Zaps that silently fail on Saturday.",
        "Humans copy-pasting between five dashboards.",
        "AI agents that talk but never update the system of record.",
        "No audit trail when an automation books the wrong provider.",
      ],
      useCases: [
        { title: "Call-to-EHR/CRM", body: "Custom AI call agents write structured notes and tasks, not a transcript dump." },
        { title: "Solar / field QA routing", body: "Ticket → severity → owner, with the NOC patterns I already know." },
        { title: "SaaS onboarding ops", body: "Provision, notify, and escalate without a human spreadsheet." },
        { title: "Multi-location clinic ops", body: "Location-aware routing of forms, faxes, and chat leads." },
      ],
      deliveryNote:
        "We automate after a process audit. If the process is nonsense, California labor cost will just scale the nonsense.",
      faqs: [
        { q: "Zapier, Make, n8n, or custom?", a: "Use hosted tools until they cannot hold SLAs, PII, or complexity. Then Python/queues. I will tell you which side you are on." },
        { q: "Will this fire people?", a: "It usually removes after-hours overload and copy-paste. Staffing decisions stay yours." },
      ],
    },
    florida: {
      h1: "Workflow Automation in Florida",
      metaTitle: "Workflow Automation in Florida | Dispatch & Ops",
      metaDescription:
        "Workflow automation for Florida home services, hospitality, healthcare, and insurance. Job booking, CRM, claims intake, and agent write-back. Remote delivery.",
      intro: [
        "Florida workflow automation searches sit next to AI call agents because the money is in the handoff: call booked → job on the board → tech notified → customer SMS. Hospitality and insurance have the same shape with different systems.",
        "I build those pipelines for Miami through Jacksonville, including storm-surge document workflows that cannot depend on one person forwarding emails.",
      ],
      problems: [
        "Jobs booked on the phone never reaching the technician.",
        "Hotel chat that does not create a reservation.",
        "Claims photos sitting in a text thread.",
        "Seasonal staff as the integration layer.",
      ],
      useCases: [
        { title: "Home-services dispatch", body: "Voice/chat → CRM → calendar → SMS, with human approval on high-ticket jobs." },
        { title: "Hospitality booking ops", body: "Chatbot and call agent write to PMS rules, not a shared inbox." },
        { title: "FNOL intake", body: "Guided collection, RAG for next questions, adjuster queue." },
        { title: "Bilingual routing", body: "Language of the customer follows the ticket, not the opposite." },
      ],
      deliveryNote:
        "ET overlap. Hurricane-season runbooks are a scoped extra, not assumed magic.",
      faqs: [
        { q: "ServiceTitan / Housecall Pro?", a: "If they have APIs or webhooks, we integrate. If they do not, we design around that honestly." },
        { q: "Is this RPA?", a: "Browser RPA is a last resort. APIs and queues first." },
      ],
    },
  },
  {
    slug: "voice-agents",
    canonicalPath: "/services/ai-agents/voice-agents",
    primaryKeyword: "AI voice agents",
    secondaryKeywords: ["voice AI", "conversational voice AI", "Vapi", "Retell", "AI telephone agent"],
    category: "AI Agents",
    shortName: "AI Voice Agents",
    summary:
      "Low-latency conversational voice agents (Vapi, Retell, Deepgram, custom WebRTC) that handle barge-in and tool calls.",
    california: {
      h1: "AI Voice Agents in California",
      metaTitle: "AI Voice Agents in California | Low-Latency Voice",
      metaDescription:
        "Custom AI voice agents for California: sub-second conversational voice, barge-in, telephony, and RAG. Built for clinics, SaaS, and operators—not demo audio.",
      intro: [
        "AI voice agents are the California search used by teams who already know “call agent” and want the conversational stack: streaming STT, interruption handling, and tool calls. I build that layer for PT-timezone operators and connect it to the same CRM/RAG systems as the call-agent page.",
      ],
      problems: [
        "Bots that cannot be interrupted.",
        "800ms+ lag that makes California callers hang up.",
        "Voice with no tools, so it only chats.",
      ],
      useCases: [
        { title: "Clinic conversational intake", body: "Natural dialogue, structured output, booking tools." },
        { title: "SaaS voice IVR replacement", body: "Intent + account lookup instead of DTMF trees." },
        { title: "After-hours LA agencies", body: "Qualify and schedule without a voicemail." },
      ],
      deliveryNote: "Latency budgets are measured on real PSTN, not headphones on Wi-Fi.",
      faqs: [
        { q: "Vapi vs custom WebRTC?", a: "Start hosted if it passes latency and HIPAA/CCPA constraints; custom when it does not." },
      ],
    },
    florida: {
      h1: "AI Voice Agents in Florida",
      metaTitle: "AI Voice Agents in Florida | Conversational Voice",
      metaDescription:
        "Custom AI voice agents for Florida home services, clinics, and hospitality. Bilingual options, barge-in, booking tools, Eastern Time delivery.",
      intro: [
        "Florida AI voice agent searches are HVAC, clinic, and hospitality. Bilingual Miami traffic needs the same conversational stack in Spanish, not a bolted-on translation.",
      ],
      problems: [
        "Robotic turn-taking that Florida callers hate.",
        "English-only voice on Miami lines.",
        "Voice agent that cannot book the job.",
      ],
      useCases: [
        { title: "HVAC conversational booking", body: "Issue, window, address, dump to dispatch." },
        { title: "Miami bilingual voice", body: "Language detect, same tools, matched handoff." },
        { title: "Hotel after-hours", body: "Reservation questions with PMS tools." },
      ],
      deliveryNote: "Spanish latency and accent robustness are eval items for South Florida.",
      faqs: [
        { q: "Will it sound local?", a: "Voice cloning and accent are scoped. Clarity and task completion beat fake Florida small talk." },
      ],
    },
  },
  {
    slug: "whatsapp-agents",
    canonicalPath: "/services/ai-agents/whatsapp-agents",
    primaryKeyword: "WhatsApp AI agents",
    secondaryKeywords: ["WhatsApp chatbot", "WhatsApp Business API agent"],
    category: "AI Agents",
    shortName: "WhatsApp Agents",
    summary: "WhatsApp Business API agents with RAG, templates, and human handoff.",
    california: {
      h1: "WhatsApp AI Agents in California",
      metaTitle: "WhatsApp AI Agents in California",
      metaDescription:
        "WhatsApp AI agents for California businesses that message customers on WhatsApp: RAG answers, templates, CRM write-back. Remote builds.",
      intro: [
        "WhatsApp is not California’s default business channel the way it is in Miami, but immigrant-heavy metros, international SaaS, and certain clinics still need WhatsApp AI agents. I build those on the official API with template rules and RAG—not a gray-market sender.",
      ],
      problems: [
        "Staff running business chat from a personal phone.",
        "No audit trail.",
        "Bots that break Meta template policies.",
      ],
      useCases: [
        { title: "International customer support", body: "Bay Area SaaS with global users who live in WhatsApp." },
        { title: "Clinic messaging", body: "Reminders and logistics, not clinical advice." },
        { title: "Logistics exceptions", body: "Photo in, ticket out." },
      ],
      deliveryNote: "Meta Business verification is on you; I wire the agent.",
      faqs: [
        { q: "Is WhatsApp worth it in California?", a: "Only if your customers already write you there. Do not force it because Florida pages mention it." },
      ],
    },
    florida: {
      h1: "WhatsApp AI Agents in Florida",
      metaTitle: "WhatsApp AI Agents in Miami & Florida",
      metaDescription:
        "WhatsApp AI agents for Miami and Florida: bilingual messaging, RAG, booking tools, Business API. Custom production systems.",
      intro: [
        "In Miami and South Florida, WhatsApp AI agents are a head-term service, not a side quest. I build bilingual agents on the Business API that share a brain with your voice and web chat.",
      ],
      problems: [
        "Front desk drowning in WhatsApp threads.",
        "English bot, Spanish customers.",
        "No connection to the booking system.",
      ],
      useCases: [
        { title: "Miami hospitality", body: "Pre-arrival questions and upsells with documented rates." },
        { title: "Clinic logistics", body: "Prep instructions retrieved from RAG, not improvised." },
        { title: "Real estate qualification", body: "Structured intake into CRM." },
      ],
      deliveryNote: "24-hour session windows and templates are designed in, not discovered in production.",
      faqs: [
        { q: "Can it send broadcasts?", a: "Only within Meta rules and your consent records. I will not build a spam cannon." },
      ],
    },
  },
  {
    slug: "telegram-agents",
    canonicalPath: "/services/ai-agents/telegram-agents",
    primaryKeyword: "Telegram AI agents",
    secondaryKeywords: ["Telegram bot", "Telegram business agent"],
    category: "AI Agents",
    shortName: "Telegram Agents",
    summary: "Telegram agents for ops teams, communities, and internal tools.",
    california: {
      h1: "Telegram AI Agents in California",
      metaTitle: "Telegram AI Agents in California",
      metaDescription:
        "Custom Telegram AI agents for California product and ops teams: internal copilots, RAG, and workflow triggers. Remote engineering.",
      intro: [
        "California Telegram AI agent demand is mostly internal: engineering and ops teams who already live in Telegram, plus communities around SaaS products. I build those agents with RAG and tools, not a hobby bot token on a laptop.",
      ],
      problems: ["Alerts with no action", "Community bots that hallucinate product facts", "No auth on internal commands"],
      useCases: [
        { title: "On-call copilot", body: "RAG over runbooks, gated commands." },
        { title: "Community product bot", body: "Cited answers, escalate to humans." },
        { title: "Ops approvals", body: "Button approvals that hit the workflow API." },
      ],
      deliveryNote: "Internal Telegram agents get SSO or shared-secret auth. No open admin commands.",
      faqs: [{ q: "Why not Slack?", a: "If you are on Slack, we build there. Telegram is for teams already on Telegram." }],
    },
    florida: {
      h1: "Telegram AI Agents in Florida",
      metaTitle: "Telegram AI Agents in Florida",
      metaDescription:
        "Telegram AI agents for Florida operators and international-facing teams: RAG, alerts, and workflow actions.",
      intro: [
        "Florida Telegram usage shows up in international hospitality, trade, and founder chats. I build agents that do work (tickets, RAG, approvals), not meme bots.",
      ],
      problems: ["Customer chat mixed with staff chat", "No CRM logging", "Unreliable hobby bots"],
      useCases: [
        { title: "Trade / logistics alerts", body: "Exception in, human-ack out." },
        { title: "Internal SOP bot", body: "RAG for staff, not guests." },
        { title: "Founder ops", body: "Lightweight approvals before you buy Slack Enterprise." },
      ],
      deliveryNote: "If WhatsApp is the customer channel, Telegram is usually staff-only. We keep that boundary.",
      faqs: [{ q: "Customer-facing Telegram in Florida?", a: "Rare vs WhatsApp. We will tell you if the channel is wrong." }],
    },
  },
  {
    slug: "llm-orchestration",
    canonicalPath: "/services/ai-engineering/llm-orchestration",
    primaryKeyword: "LLM orchestration",
    secondaryKeywords: ["LangGraph", "multi-agent systems", "agent orchestration"],
    category: "AI Engineering",
    shortName: "LLM Orchestration",
    summary: "Stateful multi-step LLM agents with tools, memory, and audit trails.",
    california: {
      h1: "LLM Orchestration in California",
      metaTitle: "LLM Orchestration in California | LangGraph Agents",
      metaDescription:
        "LLM orchestration for California SaaS and enterprises: LangGraph, tool-calling, evals, and production tracing. Remote AI engineering.",
      intro: [
        "Bay Area teams search LLM orchestration when a single prompt is not a product. I design graphs, tools, retries, and traces for California companies that need agents in production, not a notebook.",
      ],
      problems: ["Prompt spaghetti", "No traces", "Agents that loop until the bill explodes"],
      useCases: [
        { title: "Support resolver graph", body: "Retrieve, act, refuse, escalate." },
        { title: "Internal research agent", body: "Tools over your APIs with budgets." },
        { title: "Voice + RAG orchestration", body: "Same brain as the call agent, different channel." },
      ],
      deliveryNote: "Token budgets and eval gates are part of the California SaaS default spec.",
      faqs: [{ q: "CrewAI vs LangGraph?", a: "I will pick based on state and observability, not Twitter." }],
    },
    florida: {
      h1: "LLM Orchestration in Florida",
      metaTitle: "LLM Orchestration in Florida | Multi-Step Agents",
      metaDescription:
        "LLM orchestration for Florida operators: multi-step agents for intake, dispatch, and document workflows with audit logs.",
      intro: [
        "Florida LLM orchestration searches are less “research agent” and more “intake → verify → book → notify.” I build those graphs so home-services and healthcare teams get reliability, not a demo swarm.",
      ],
      problems: ["Chatbot that cannot complete a job", "No log of what the agent did", "Hidden model spend"],
      useCases: [
        { title: "Job intake graph", body: "Collect, validate address, book, SMS." },
        { title: "Claims packet agent", body: "Ask, OCR, file, queue." },
        { title: "Hospitality exception agent", body: "Policy RAG then a bounded action." },
      ],
      deliveryNote: "Human-in-the-loop checkpoints are the default for money-moving steps.",
      faqs: [{ q: "Fully autonomous?", a: "Not for refunds, diagnoses, or legal commitments. Those stay gated." }],
    },
  },
  {
    slug: "prompt-engineering",
    canonicalPath: "/services/ai-engineering/prompt-engineering",
    primaryKeyword: "prompt engineering",
    secondaryKeywords: ["prompt evals", "system prompts", "LLM evaluation"],
    category: "AI Engineering",
    shortName: "Prompt Engineering",
    summary: "Prompt systems, eval harnesses, and registries—not a PDF of magic phrases.",
    california: {
      h1: "Prompt Engineering in California",
      metaTitle: "Prompt Engineering in California | Evals & Systems",
      metaDescription:
        "Prompt engineering for California AI teams: eval harnesses, prompt registries, and production system prompts for RAG and call agents.",
      intro: [
        "California prompt engineering demand is from teams who already have a model in prod and are losing quality. I build eval sets and prompt systems for RAG agents and call agents, especially Bay Area product orgs.",
      ],
      problems: ["Prompts in Slack", "No regression tests", "A/B by vibes"],
      useCases: [
        { title: "Support prompt registry", body: "Versioned prompts with eval gates." },
        { title: "Voice script systems", body: "California two-party consent language baked in." },
        { title: "RAG answer style", body: "Citation-first, refuse-when-unknown." },
      ],
      deliveryNote: "I will not sell a 50-page prompt pack. The deliverable is a tested system.",
      faqs: [{ q: "Do you fine-tune instead?", a: "Only when evals say prompts and retrieval lost. Fine-tune is not the first knob." }],
    },
    florida: {
      h1: "Prompt Engineering in Florida",
      metaTitle: "Prompt Engineering in Florida | Voice & Bilingual",
      metaDescription:
        "Prompt engineering for Florida voice and chat agents: bilingual evals, booking scripts, and refusal policies.",
      intro: [
        "Florida prompt work is bilingual voice/chat and strict refusal (no medical advice, no invented rates). I write and eval those systems for Miami through Orlando operators.",
      ],
      problems: ["Spanish as an afterthought", "Agents that diagnose", "Inconsistent booking scripts"],
      useCases: [
        { title: "EN/ES voice prompts", body: "Separate evals, shared tools." },
        { title: "Hospitality refusal", body: "Cannot invent comps." },
        { title: "Home-services script", body: "Issue → window → dispatch fields." },
      ],
      deliveryNote: "Spanish evals are not optional for Miami scopes.",
      faqs: [{ q: "One prompt two languages?", a: "Usually two prompt tracks, one tool layer." }],
    },
  },
  {
    slug: "nextjs-development",
    canonicalPath: "/services/software-engineering/nextjs-development",
    primaryKeyword: "Next.js development",
    secondaryKeywords: ["Next.js agency", "React SaaS frontend"],
    category: "Software Engineering",
    shortName: "Next.js Development",
    summary: "Production Next.js apps that host the chatbots, dashboards, and marketing sites the agents live in.",
    california: {
      h1: "Next.js Development in California",
      metaTitle: "Next.js Development in California",
      metaDescription:
        "Next.js development for California product teams: AI chatbot UIs, dashboards, and marketing sites with production SEO. Remote engineering.",
      intro: [
        "California Next.js work here is in service of the agents: streaming chat UIs, admin eval dashboards, and service landing pages that can actually rank. I build those apps for PT-timezone product teams.",
      ],
      problems: ["Chat UI that blocks the thread", "SEO pages that are client-only shells", "No design system"],
      useCases: [
        { title: "RAG chat surface", body: "SSE streaming, citations, auth." },
        { title: "Service SEO pages", body: "The same stack this site uses." },
        { title: "Internal ops UI", body: "For the workflow automations." },
      ],
      deliveryNote: "App Router, server components where they pay rent, no SPA-for-everything.",
      faqs: [{ q: "Can you take over an existing Next app?", a: "Yes, after a short architecture review." }],
    },
    florida: {
      h1: "Next.js Development in Florida",
      metaTitle: "Next.js Development in Florida",
      metaDescription:
        "Next.js development for Florida operators: bilingual sites, booking UIs, and AI chatbot embeds that convert.",
      intro: [
        "Florida Next.js demand is marketing + booking + bilingual. I build sites that host custom AI chatbots and capture the lead into the same workflows as the call agents.",
      ],
      problems: ["Wix chat plugins", "English-only sites in Miami", "No structured data"],
      useCases: [
        { title: "Hospitality booking UI", body: "Tied to real inventory APIs." },
        { title: "Clinic site + bot", body: "SEO pages + grounded chat." },
        { title: "Bilingual marketing", body: "Hreflang only if you truly maintain two languages." },
      ],
      deliveryNote: "If you need a local Florida Webflow shop for brand, hire them; I own the agent-grade frontend.",
      faqs: [{ q: "WordPress instead?", a: "Possible, but Next.js is the default for these AI surfaces." }],
    },
  },
  {
    slug: "saas-development",
    canonicalPath: "/services/software-engineering/saas-development",
    primaryKeyword: "SaaS development",
    secondaryKeywords: ["custom SaaS", "AI SaaS build"],
    category: "Software Engineering",
    shortName: "SaaS Development",
    summary: "Multi-tenant SaaS that productizes your agents—if you actually need a product, not a one-off.",
    california: {
      h1: "SaaS Development in California",
      metaTitle: "SaaS Development in California | AI Products",
      metaDescription:
        "Custom SaaS development for California founders: multi-tenant AI agents, billing, and production infrastructure. Remote senior engineering.",
      intro: [
        "Bay Area and LA founders searching SaaS development here usually want to productize a RAG or voice agent. I build the multi-tenant core; I will also tell you when you only need a one-off agent for your own company.",
      ],
      problems: ["Wrapper with no tenancy", "No metering", "Demo that cannot onboard a second customer"],
      useCases: [
        { title: "Vertical AI SaaS", body: "Clinic or solar ops productized." },
        { title: "Internal platform", body: "One RAG core, many business units." },
        { title: "Usage billing", body: "Tokens and minutes metered." },
      ],
      deliveryNote: "If you do not have distribution, a custom SaaS will not save you. We talk about that first.",
      faqs: [{ q: "Equity or cash?", a: "Cash engagements. I am not your cofounder by default." }],
    },
    florida: {
      h1: "SaaS Development in Florida",
      metaTitle: "SaaS Development in Florida",
      metaDescription:
        "Custom SaaS development for Florida operators who want to productize call agents or workflow automation.",
      intro: [
        "Florida SaaS searches in this catalog are often home-services or hospitality platforms. I will scope a real multi-tenant product vs a custom agent for a single brand—most teams need the latter.",
      ],
      problems: ["Buying five SaaS tools that do not talk", "Wanting to become a software company overnight"],
      useCases: [
        { title: "Single-brand agent stack", body: "Usually the right call." },
        { title: "Multi-location platform", body: "When you truly sell software." },
        { title: "Franchise tooling", body: "Tenancy and location routing." },
      ],
      deliveryNote: "Default recommendation: custom agents first, SaaS only with a real wedge.",
      faqs: [{ q: "Can you clone ServiceTitan?", a: "No, and you should not try. We automate around it or build a thin vertical." }],
    },
  },
  {
    slug: "backend-engineering",
    canonicalPath: "/services/software-engineering/backend-engineering",
    primaryKeyword: "backend engineering",
    secondaryKeywords: ["API development", "Python backend", "high concurrency"],
    category: "Software Engineering",
    shortName: "Backend Engineering",
    summary: "APIs, queues, and concurrency for agents that actually have to run at volume.",
    california: {
      h1: "Backend Engineering in California",
      metaTitle: "Backend Engineering in California | APIs for AI Agents",
      metaDescription:
        "Backend engineering for California AI systems: high-concurrency APIs, queues, and telephony backends for call agents and RAG.",
      intro: [
        "Custom AI call agents in California fail when the backend cannot hold SIP load or tool-call latency. I build those backends for PT-timezone teams who need production, not a Cloud Run toy.",
      ],
      problems: ["Synchronous LLM calls on the request thread", "No queues", "Secrets in frontend"],
      useCases: [
        { title: "Telephony workers", body: "Celery/queues for outbound and post-call jobs." },
        { title: "RAG API", body: "Auth, quotas, tracing." },
        { title: "Webhook fabric", body: "CRM and Stripe events into workflows." },
      ],
      deliveryNote: "Go or Python depending on latency and your team’s ability to maintain it.",
      faqs: [{ q: "Will you join as staff engineer?", a: "Contract first. Full-time is a separate conversation." }],
    },
    florida: {
      h1: "Backend Engineering in Florida",
      metaTitle: "Backend Engineering in Florida",
      metaDescription:
        "Backend engineering for Florida AI call agents and workflow automation: APIs, queues, and integrations that survive peak season.",
      intro: [
        "Florida backends here exist so hospitality spikes and storm-week claim volume do not melt a chatbot. I design queues, retries, and integrations for ET-timezone operators.",
      ],
      problems: ["Peak-season 502s", "Lost webhooks", "No idempotency on bookings"],
      useCases: [
        { title: "Booking APIs", body: "Idempotent reservations." },
        { title: "Dispatch workers", body: "Retry without double-booking techs." },
        { title: "Call post-processing", body: "Transcript → CRM async." },
      ],
      deliveryNote: "Load assumptions are written down. “It worked in March” is not a spec.",
      faqs: [{ q: "PHP monolith?", a: "We can wrap it. Rewrites are a choice, not a default." }],
    },
  },
  {
    slug: "architecture-review",
    canonicalPath: "/services/technical-consulting/architecture-review",
    primaryKeyword: "AI architecture review",
    secondaryKeywords: ["RAG architecture review", "voice AI audit"],
    category: "Technical Consulting",
    shortName: "Architecture Review",
    summary: "A paid teardown of your current RAG, voice, or automation stack before you spend another quarter.",
    california: {
      h1: "AI Architecture Review in California",
      metaTitle: "AI Architecture Review in California",
      metaDescription:
        "Architecture review for California RAG, call agents, and LLM stacks. Written findings, risks, and a build sequence. Remote senior review.",
      intro: [
        "California teams (especially Bay Area) often need an architecture review more than another vendor. I review RAG, voice, and workflow systems and write down what will fail in production.",
      ],
      problems: ["Six tools, no owner", "Vector DB with no evals", "Voice vendor lock-in"],
      useCases: [
        { title: "Pre-series-B AI stack", body: "What to keep vs rewrite." },
        { title: "Healthcare RAG risk", body: "ACL and logging gaps." },
        { title: "Call center AI", body: "Concurrency and consent gaps." },
      ],
      deliveryNote: "Deliverable is a written review, not a sales deck.",
      faqs: [{ q: "Will you trash our vendor?", a: "I will say if they fit. I will not run a smear because I sell custom." }],
    },
    florida: {
      h1: "AI Architecture Review in Florida",
      metaTitle: "AI Architecture Review in Florida",
      metaDescription:
        "Architecture review for Florida AI call agents, chatbots, and automations—especially after a failed local-agency install.",
      intro: [
        "Florida architecture reviews often follow a packaged AI-agent install that cannot book jobs or speak Spanish. I document the gaps and the cheapest path to a system that works.",
      ],
      problems: ["Agency left a prompt in a dashboard", "No CRM integration", "No bilingual plan"],
      useCases: [
        { title: "Failed voice install", body: "Keep telephony, replace the brain." },
        { title: "Chat widget autopsy", body: "What the bot can and cannot do." },
        { title: "Automation sprawl", body: "Which zaps to kill." },
      ],
      deliveryNote: "You get a sequence of work. You can hire me or someone else to execute.",
      faqs: [{ q: "Can you review without code access?", a: "Shallow. Real reviews need architecture and sample traces." }],
    },
  },
  {
    slug: "ai-feasibility-study",
    canonicalPath: "/services/technical-consulting/ai-feasibility-study",
    primaryKeyword: "AI feasibility study",
    secondaryKeywords: ["AI consulting", "should we build an agent"],
    category: "Technical Consulting",
    shortName: "AI Feasibility Study",
    summary: "Build / buy / wait—with numbers—before you commission custom AI call agents or RAG.",
    california: {
      h1: "AI Feasibility Study in California",
      metaTitle: "AI Feasibility Study in California",
      metaDescription:
        "AI feasibility studies for California operators: whether custom AI call agents, chatbots, or RAG agents will pay off. Written recommendation.",
      intro: [
        "Not every California company should build custom AI call agents. I run a feasibility study when the buyer is a clinic group, SaaS, or ops team that has budget pressure and a noisy vendor market.",
      ],
      problems: ["Board wants AI", "Vendor theater", "No baseline metrics"],
      useCases: [
        { title: "Clinic group", body: "Call volume vs staff cost vs risk." },
        { title: "SaaS support", body: "Deflection vs hallucination cost." },
        { title: "Internal RAG", body: "Corpus quality first." },
      ],
      deliveryNote: "Sometimes the answer is buy a tool or fix the process. I will say that.",
      faqs: [{ q: "Is this just a sales funnel?", a: "You get a written recommendation either way. Implementation is optional." }],
    },
    florida: {
      h1: "AI Feasibility Study in Florida",
      metaTitle: "AI Feasibility Study in Florida",
      metaDescription:
        "AI feasibility for Florida home services, hospitality, and healthcare: build custom agents or stop at a simpler automation.",
      intro: [
        "Florida feasibility work is often “should we buy the Orlando AI package or build custom?” I compare call volume, language needs, and integration reality so you do not spend a year on the wrong thing.",
      ],
      problems: ["Sales-led AI packages", "No bilingual costing", "No integration inventory"],
      useCases: [
        { title: "HVAC company", body: "Voice vs answering service vs hire." },
        { title: "Hotel group", body: "Chat vs call vs both." },
        { title: "Clinic", body: "What must never be automated." },
      ],
      deliveryNote: "Spanish coverage and storm overflow are first-class inputs in Florida studies.",
      faqs: [{ q: "How long?", a: "Usually a short paid sprint, not a six-month consultant residency." }],
    },
  },
];
