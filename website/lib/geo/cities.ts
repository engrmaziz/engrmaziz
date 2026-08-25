import type { GeoCity } from "./types";

export const CITIES: GeoCity[] = [
  {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "california",
    metro: "Los Angeles County / Greater LA",
    h1: "Custom AI Call Agents, Chatbots & RAG Agents in Los Angeles",
    metaTitle: "AI Call Agents, Chatbots & RAG in Los Angeles",
    metaDescription:
      "Custom AI call agents, AI chatbots, RAG agents, and workflow automation for Los Angeles companies. Remote production builds for clinics, agencies, logistics, and studios.",
    intro: [
      "Los Angeles searches for custom AI call agents are usually coming from clinics, dental groups, home-services brands, talent and marketing agencies, and logistics operators tied to the ports. The common failure mode is the same: a hosted voice bot that cannot see the practice-management system, or a website chatbot that invents insurance coverage.",
      "I build Los Angeles-facing systems remotely: inbound and outbound AI call agents, custom AI chatbots with RAG, and workflow automation that writes back to the tools the front desk already uses. Greater LA is Pacific Time, so live architecture sits in the morning PT window.",
      "This page is for Los Angeles intent. Statewide catalog and other California cities are linked below so Google and humans can tell LA apart from a generic California doorway.",
    ],
    industries: [
      "Multi-location dental and medical groups",
      "Agencies and high-volume inbound sales",
      "3PL and port-adjacent dispatch",
      "Entertainment-adjacent operations and production offices",
      "Home services across LA County",
    ],
    demand: [
      { serviceSlug: "custom-ai-call-agents", why: "After-hours phones in clinics and agencies are the #1 lost-revenue leak in LA service businesses." },
      { serviceSlug: "custom-ai-chatbots", why: "Web and Instagram traffic in LA converts if the bot can book, not just chat." },
      { serviceSlug: "rag-agents", why: "SOPs and insurance scripts must be retrieved, not improvised, especially in healthcare." },
      { serviceSlug: "workflow-automation", why: "Front desks should not re-type every call into Dentrix, HubSpot, or a spreadsheet." },
    ],
    faqs: [
      {
        q: "Do you meet in person in Los Angeles?",
        a: "No. Delivery is remote with PT overlap. If you require on-site workshops in Santa Monica, hire a local integrator and keep me on the architecture if you want.",
      },
      {
        q: "Can one agent cover multiple LA locations?",
        a: "Yes. Location-aware routing (NAP, hours, providers, service menus) is a first-class requirement for multi-location LA groups.",
      },
    ],
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    state: "california",
    metro: "San Francisco Bay Area",
    h1: "RAG Agents, Custom AI Chatbots & Workflow Automation in San Francisco",
    metaTitle: "RAG Agents & AI Chatbots in San Francisco",
    metaDescription:
      "RAG agents, custom AI chatbots, LLM orchestration, and workflow automation for San Francisco and Bay Area SaaS teams. Production retrieval, not demo wrappers.",
    intro: [
      "San Francisco and the wider Bay Area search RAG agents and custom AI chatbots for a different reason than LA clinics: product documentation, internal wikis, and support macros that cannot be trusted to a generic LLM. Founders and staff engineers want evals, citations, and permissioning, not a Notion AI overlay.",
      "I build production RAG pipelines, support chatbots, and LLM orchestration for Bay Area teams who already know LangChain exists and are tired of prototypes that fail on real tickets. Call agents still matter for PLG companies with phone sales, but the head term here is retrieval quality.",
      "Work is remote with PT overlap. This page targets San Francisco / Bay Area queries; San Jose and Peninsula teams are in the same metro intent cluster.",
    ],
    industries: [
      "B2B SaaS support and solutions engineering",
      "AI-native startups that still need a real retrieval layer",
      "Fintech and compliance-heavy documentation",
      "Internal knowledge bases for multi-product companies",
    ],
    demand: [
      { serviceSlug: "rag-agents", why: "Bay Area buyers search RAG when hallucinations hit paying customers." },
      { serviceSlug: "custom-ai-chatbots", why: "In-app and docs chatbots that cite sources, not marketing widgets." },
      { serviceSlug: "llm-orchestration", why: "Multi-step agents over internal tools beat a single prompt." },
      { serviceSlug: "prompt-engineering", why: "Eval harnesses and prompt registries for teams past the playground stage." },
    ],
    faqs: [
      {
        q: "Do you only work with startups?",
        a: "No. Bay Area enterprises with messy SharePoint estates need RAG more than a five-person startup does. The constraint is production ownership, not headcount.",
      },
      {
        q: "Can you work inside our VPC?",
        a: "Yes. RAG agents for SF companies often stay in the customer cloud. That is a scoping item, not a slogan.",
      },
    ],
  },
  {
    slug: "san-diego",
    name: "San Diego",
    state: "california",
    metro: "San Diego County",
    h1: "Custom AI Call Agents, RAG & Healthcare Automation in San Diego",
    metaTitle: "AI Call Agents & RAG in San Diego",
    metaDescription:
      "Custom AI call agents, RAG agents, and workflow automation for San Diego healthcare, biotech, and service businesses. Remote production engineering.",
    intro: [
      "San Diego’s mix is healthcare, biotech, defense-adjacent contractors, and a large service-business layer. Searches for custom AI call agents here often come from medical groups; searches for RAG agents come from teams sitting on SOPs and regulated documents.",
      "I design call agents and RAG with that mix in mind: least-privilege retrieval, human handoff, and workflow automation into the systems already running the clinic or lab. Not a consumer chatbot pointed at a PDF dump.",
    ],
    industries: [
      "Healthcare systems and specialty clinics",
      "Biotech and life-science operations",
      "Defense-adjacent documentation (unclassified internal knowledge)",
      "Hospitality and service businesses along the coast",
    ],
    demand: [
      { serviceSlug: "custom-ai-call-agents", why: "Clinic phones in San Diego overflow the same way they do in LA—volume plus after-hours." },
      { serviceSlug: "rag-agents", why: "SOPs and quality docs cannot be dumped into a public model." },
      { serviceSlug: "ai-feasibility-study", why: "Biotech teams often need a build/no-build decision before buying seats." },
    ],
    faqs: [
      {
        q: "Do you handle PHI?",
        a: "Systems can be designed so PHI stays in your infrastructure. I do not become your HIPAA officer. Your BAA and counsel still govern.",
      },
    ],
  },
  {
    slug: "sacramento",
    name: "Sacramento",
    state: "california",
    metro: "Sacramento metro",
    h1: "Workflow Automation, RAG Agents & AI Chatbots in Sacramento",
    metaTitle: "Workflow Automation & RAG in Sacramento",
    metaDescription:
      "Workflow automation, RAG agents, and custom AI chatbots for Sacramento agencies, healthcare, and operators who need production systems—not another chatbot trial.",
    intro: [
      "Sacramento intent is heavier on government-adjacent operations, healthcare, and regional service businesses than on Bay Area SaaS. Workflow automation and RAG agents show up when teams are drowning in forms, email, and shared drives.",
      "I build those pipelines remotely for Sacramento organizations that need audit trails and human approval steps, not fully unsupervised agents touching constituent data.",
    ],
    industries: [
      "Healthcare and regional medical groups",
      "Professional services and associations",
      "Logistics and Central Valley operators",
      "Civic-adjacent document workflows",
    ],
    demand: [
      { serviceSlug: "workflow-automation", why: "Form-to-system handoffs are the Sacramento pain, not demo voice agents." },
      { serviceSlug: "rag-agents", why: "Policy manuals and shared drives need retrieval with citations." },
      { serviceSlug: "custom-ai-chatbots", why: "Public-facing FAQs that must not invent policy." },
    ],
    faqs: [
      {
        q: "Do you bid on state contracts?",
        a: "Direct prime on large California government vehicles is not the default motion. Private operators and vendors serving those programs are a better fit.",
      },
    ],
  },
  {
    slug: "orange-county",
    name: "Orange County",
    state: "california",
    metro: "Orange County / OC",
    h1: "Custom AI Call Agents & Chatbots in Orange County",
    metaTitle: "AI Call Agents & Chatbots in Orange County",
    metaDescription:
      "Custom AI call agents, chatbots, and workflow automation for Orange County clinics, home services, and multi-location operators.",
    intro: [
      "Orange County searches cluster around dental, medical aesthetics, home services, and multi-location retail ops. Custom AI call agents that book against real calendars beat a national “AI receptionist” that cannot see which Irvine office is open on Saturday.",
      "I wire voice, chat, and workflow automation into the PMS/CRM you already pay for, delivered remotely on Pacific Time overlap.",
    ],
    industries: [
      "Dental and specialty medical",
      "Home services and restoration",
      "Multi-location consumer brands",
      "Professional services",
    ],
    demand: [
      { serviceSlug: "custom-ai-call-agents", why: "OC clinics compete on speed-to-answer as much as on clinical quality." },
      { serviceSlug: "custom-ai-chatbots", why: "Paid traffic is wasted if the site bot cannot schedule." },
      { serviceSlug: "whatsapp-agents", why: "Some OC patient populations prefer messaging over a phone tree." },
    ],
    faqs: [
      {
        q: "Irvine vs Anaheim vs Newport—does it matter?",
        a: "For the agent, yes: hours, providers, parking, and service menus differ. For me as the engineer, it is one metro with location-aware configuration.",
      },
    ],
  },
  {
    slug: "miami",
    name: "Miami",
    state: "florida",
    metro: "Miami-Dade / South Florida",
    h1: "Custom AI Call Agents, WhatsApp Agents & Chatbots in Miami",
    metaTitle: "AI Call Agents & Chatbots in Miami",
    metaDescription:
      "Bilingual custom AI call agents, WhatsApp agents, RAG chatbots, and workflow automation for Miami and South Florida businesses.",
    intro: [
      "Miami is the Florida city where “custom AI call agents” almost always implies English and Spanish on the same number, plus WhatsApp as a first-class channel. A California-style English-only voice bot will lose half the market before the first transfer.",
      "I build bilingual call agents, WhatsApp agents, and RAG chatbots for Miami operators in hospitality, healthcare, real estate, logistics, and professional services. Delivery is remote with Eastern Time overlap. No fabricated Brickell headquarters.",
    ],
    industries: [
      "Hospitality and tourism",
      "Bilingual healthcare and dental",
      "Real estate and property management",
      "Trade and logistics through the port",
      "Professional services",
    ],
    demand: [
      { serviceSlug: "custom-ai-call-agents", why: "Speed-to-answer in EN/ES is a Miami sales advantage." },
      { serviceSlug: "whatsapp-agents", why: "WhatsApp is a default business channel in South Florida, not a novelty." },
      { serviceSlug: "custom-ai-chatbots", why: "Web and ads traffic still needs a grounded bot that can book." },
      { serviceSlug: "rag-agents", why: "Policies, rate cards, and listing docs must be retrieved in the caller’s language." },
    ],
    faqs: [
      {
        q: "Spanish from day one?",
        a: "For Miami, yes—treat it as a launch requirement unless you explicitly sell English-only.",
      },
      {
        q: "Do you compete with Miami AI agencies?",
        a: "They package local presence and managed seats. I engineer custom systems. Different SERP intent.",
      },
    ],
  },
  {
    slug: "tampa",
    name: "Tampa",
    state: "florida",
    metro: "Tampa Bay",
    h1: "Custom AI Call Agents, RAG & Workflow Automation in Tampa",
    metaTitle: "AI Call Agents & Automation in Tampa",
    metaDescription:
      "Custom AI call agents, RAG agents, and workflow automation for Tampa Bay healthcare, home services, and operators who need production systems.",
    intro: [
      "Tampa Bay searches mix healthcare, home services, insurance, and regional logistics. Custom AI call agents here are often an HVAC or clinic problem; RAG agents show up in insurance and healthcare documentation.",
      "I build those stacks remotely for Tampa operators who need the agent to write to the dispatch board or EHR-adjacent workflow, not just talk.",
    ],
    industries: [
      "Healthcare and dental",
      "HVAC and home services",
      "Insurance and claims ops",
      "Port and regional logistics",
    ],
    demand: [
      { serviceSlug: "custom-ai-call-agents", why: "Job booking on the first call is the Tampa home-services war." },
      { serviceSlug: "workflow-automation", why: "Call → CRM → tech dispatch is where margin is won or lost." },
      { serviceSlug: "rag-agents", why: "Benefits and SOP questions cannot be guessed." },
    ],
    faqs: [
      {
        q: "St. Petersburg and Clearwater too?",
        a: "Yes. Tampa Bay is one intent cluster for these services.",
      },
    ],
  },
  {
    slug: "orlando",
    name: "Orlando",
    state: "florida",
    metro: "Greater Orlando / Central Florida",
    h1: "AI Chatbots, Call Agents & Workflow Automation in Orlando",
    metaTitle: "AI Chatbots & Call Agents in Orlando",
    metaDescription:
      "Custom AI chatbots, call agents, and workflow automation for Orlando hospitality, healthcare, and Central Florida operators.",
    intro: [
      "Orlando SERPs for AI automation are crowded with local agencies. This page is for custom AI chatbots and call agents tied to hospitality PMS, clinic schedules, and high-season overflow—not a generic “100 agents” package.",
      "Theme-park-adjacent volume is spiky. Agents need queueing, human overflow, and workflow automation that does not lose a booking when the front desk is slammed.",
    ],
    industries: [
      "Hospitality and vacation rentals",
      "Healthcare and dental",
      "Home services supporting growth suburbs",
      "Tourism-adjacent retail and attractions",
    ],
    demand: [
      { serviceSlug: "custom-ai-chatbots", why: "Hotel and rental sites convert on chat if inventory and rates are real." },
      { serviceSlug: "custom-ai-call-agents", why: "After-hours booking is revenue in a 24-hour visitor market." },
      { serviceSlug: "workflow-automation", why: "Seasonal staff should not be the integration layer." },
    ],
    faqs: [
      {
        q: "Are you the Orlando firm on Kirkman Road?",
        a: "No. That is a different company. This is a remote custom-engineering practice serving Orlando.",
      },
    ],
  },
  {
    slug: "jacksonville",
    name: "Jacksonville",
    state: "florida",
    metro: "Jacksonville / Northeast Florida",
    h1: "Workflow Automation, RAG Agents & Call Agents in Jacksonville",
    metaTitle: "Workflow Automation & AI Agents in Jacksonville",
    metaDescription:
      "Workflow automation, RAG agents, and custom AI call agents for Jacksonville logistics, healthcare, and Northeast Florida operators.",
    intro: [
      "Jacksonville intent leans logistics, healthcare, insurance, and military-adjacent families. Workflow automation and RAG agents often outrank flashy voice demos because the pain is documents and handoffs, not Instagram leads.",
      "I still build custom AI call agents for Jacksonville service businesses; the catalog is just weighted toward ops systems that survive real freight and clinic volume.",
    ],
    industries: [
      "Logistics, trucking, and port ops",
      "Healthcare systems",
      "Insurance",
      "Home services across a geographically huge city",
    ],
    demand: [
      { serviceSlug: "workflow-automation", why: "Dispatch and document chasing are the Jacksonville bottleneck." },
      { serviceSlug: "rag-agents", why: "SOPs and contracts need retrieval, not another shared inbox." },
      { serviceSlug: "custom-ai-call-agents", why: "Coverage across a spread-out metro still starts on the phone." },
    ],
    faqs: [
      {
        q: "Do you know the port workflows?",
        a: "I have shipped logistics-adjacent agents and ops automation. We map your TMS/CRM in discovery; I do not fake a Jacksonville warehouse address.",
      },
    ],
  },
  {
    slug: "fort-lauderdale",
    name: "Fort Lauderdale",
    state: "florida",
    metro: "Broward / Fort Lauderdale",
    h1: "Custom AI Call Agents & WhatsApp Agents in Fort Lauderdale",
    metaTitle: "AI Call Agents in Fort Lauderdale",
    metaDescription:
      "Custom AI call agents, WhatsApp agents, and chatbots for Fort Lauderdale and Broward County businesses, including bilingual South Florida routing.",
    intro: [
      "Fort Lauderdale sits in the same bilingual South Florida cluster as Miami, with a strong marine, hospitality, healthcare, and professional-services layer. Custom AI call agents and WhatsApp agents are the head terms; RAG keeps those agents honest.",
      "Remote delivery, Eastern Time overlap, location-aware hours and menus for Broward multi-location groups.",
    ],
    industries: [
      "Marine and hospitality",
      "Healthcare and dental",
      "Professional services",
      "Home services in Broward",
    ],
    demand: [
      { serviceSlug: "custom-ai-call-agents", why: "Broward service businesses lose jobs to whoever answers first." },
      { serviceSlug: "whatsapp-agents", why: "Same bilingual messaging demand as Miami-Dade." },
      { serviceSlug: "custom-ai-chatbots", why: "Paid search in Fort Lauderdale still dies in a dead contact form." },
    ],
    faqs: [
      {
        q: "Miami or Fort Lauderdale page—which one?",
        a: "If your customers say “South Florida,” either hub works; this page exists so Broward queries are not a thin copy of Miami.",
      },
    ],
  },
];
