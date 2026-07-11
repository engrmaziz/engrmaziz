# WEBSITE MASTER SPECIFICATION
**Version:** 1.0.0
**Target Framework:** Next.js App Router, Tailwind CSS, shadcn/ui

## WEBSITE VISION

### Mission
To build the definitive digital headquarters for a premium Backend AI/ML Engineer. The platform must project FAANG-level engineering rigor, demonstrating that the creator does not just build websites, but architects enterprise-grade, highly concurrent, and fault-tolerant AI systems.

### Goals
- Function as the canonical source of truth for all professional knowledge, architectures, and capabilities.
- Serve as the technical foundation for future RAG pipelines, MCP integrations, and autonomous agents.
- Convert high-value technical stakeholders (CTOs, Founders, Enterprise Clients) into qualified leads.

### Purpose
This is not a portfolio. This is an Enterprise Knowledge Platform. It proves technical competence by existing as a perfectly architected system itself.

### Target Audience
1. **Founders & CEOs:** Seeking high-ROI AI automation and scalable architectures.
2. **CTOs & VPs of Engineering:** Evaluating backend capabilities, system design, and security principles.
3. **Enterprise Clients:** Looking for reliable RAG pipelines and workflow automation.
4. **Recruiters & Hiring Managers:** Verifying specific technical skills, metrics, and case studies.
5. **Software Engineers:** Reading deep-dive architecture blogs for technical growth.

### Competitive Positioning
Positioned above generalist "Full Stack Developers" and "Web Agencies." Positioned as a specialized **Principal Backend & AI Architect**. The platform trades flashy, distractive animations for brutalist performance, extreme technical clarity, and verified metrics.

### Brand Personality
- **Authoritative:** Commands respect through empirical evidence.
- **Precise:** Zero hyperbole. Every claim is quantified.
- **Transparent:** Openly discusses architectural tradeoffs and limitations.
- **Forward-Thinking:** Deeply integrated with modern AI primitives (RAG, LLMs, Agents).

### Brand Voice
Direct, empirical, and highly technical. Use active voice. Avoid corporate jargon ("synergy", "paradigm shift"). Use precise engineering terminology ("latency", "concurrency", "vector embeddings").

### Unique Value Proposition
The intersection of heavy backend engineering (PostgreSQL, Docker, CI/CD) and state-of-the-art AI integration (CRAG, LangGraph, Vector DBs). The ability to not just build a wrapper, but to architect the infrastructure that makes AI scalable and safe.

### Trust Signals
- Verified GitHub Source Code Links.
- Quantifiable business metrics (e.g., 10M PKR sales, sub-500ms latency).
- Open architectural diagrams and implementation tradeoffs.
- Strict adherence to WCAG 2.2 AA and Core Web Vitals.

### Visitor Journeys
- **The Audit:** Home -> Projects -> Architecture Diagram -> GitHub Repo -> Contact.
- **The Solution Seek:** Search -> Service Page (RAG) -> Case Study (SHBRAG) -> Contact.
- **The Discovery:** Google Search -> Technical Blog Post -> About -> Newsletter/Contact.

### Conversion Goals
- Primary: Lead generation via direct technical qualification form.
- Secondary: Newsletter subscription for technical architecture blog.
- Secondary: LinkedIn connection.

---

## COMPLETE WEBSITE MAP

### Navigation Hierarchy
- `/` (Home)
- `/services`
- `/projects`
- `/blog`
- `/about`
- `/contact`

### Route Definitions
#### Primary Routes
- `/` (Static)
- `/about` (Static)
- `/contact` (Static)
- `/projects` (Static)
- `/services` (Static)
- `/blog` (Static)

#### Dynamic Routes
- `/projects/[slug]` (Static Generation via `generateStaticParams`)
- `/services/[slug]` (Static Generation via `generateStaticParams`)
- `/blog/[slug]` (Static Generation via `generateStaticParams`)
- `/technologies/[slug]` (Static Generation)
- `/industries/[slug]` (Static Generation)

#### Utility & Legal Routes
- `/search` (Client-side hydration or Server-side search API)
- `/faq` (Static)
- `/resume` (Static)
- `/uses` (Static - Developer Workspace Setup)
- `/timeline` (Static)
- `/privacy` (Static)
- `/terms` (Static)
- `/rss.xml` (Route Handler)
- `/sitemap.xml` (Route Handler)
- `/robots.txt` (Route Handler)

#### Error Boundaries
- `app/not-found.tsx` (404)
- `app/error.tsx` (500)

### Internal Linking Strategy
- Every `Service` must link to its implementing `Project`.
- Every `Project` must link to its underlying `Technologies`.
- Every `Blog` must link to related `Services` and `Technologies`.
- All internal links must use strict semantic anchor text (e.g., "implemented with FastAPI" rather than "click here").

### Search Hierarchy
- `CMD+K` (macOS) / `CTRL+K` (Windows) global command palette.
- Supports indexing across Projects, Services, Blog, and Technologies.

---

## DESIGN SYSTEM

### Typography
- **Primary Font:** Inter (Sans-serif) for body and UI elements. Optimizes for dense technical readability.
- **Secondary/Monospace Font:** JetBrains Mono or Fira Code for all code blocks, JSON snippets, and technical badges.
- **Hierarchy:**
  - H1: 3.75rem (60px), Tracking tight, Font-weight 800.
  - H2: 2.25rem (36px), Tracking tight, Font-weight 700.
  - H3: 1.5rem (24px), Font-weight 600.
  - Body: 1rem (16px), Line-height 1.75 (Relaxed for long-form reading).
  - Code: 0.875rem (14px).

### Spacing & Grid
- **System:** Tailwind 4px baseline (`spacing-1` = 0.25rem).
- **Layout Grid:** 12-column CSS Grid for maximum responsiveness.
- **Max Width:** Container capped at `max-w-7xl` (1280px) to prevent ultrawide text stretching. Blog posts capped at `max-w-3xl` (768px) for optimal reading line length (60-80 characters).

### Breakpoints
- `sm`: 640px (Mobile landscape)
- `md`: 768px (Tablet)
- `lg`: 1024px (Laptop)
- `xl`: 1280px (Desktop)
- `2xl`: 1536px (Ultrawide)

### Color Palette (Dark Mode First)
- **Background:** `#09090b` (Zinc-950)
- **Foreground:** `#fafafa` (Zinc-50)
- **Primary:** `#3b82f6` (Blue-500) for interactive elements and trust signals.
- **Muted/Borders:** `#27272a` (Zinc-800) for subtle panel separation.
- **Accents:** Green (`#22c55e`) for success/live metrics, Red (`#ef4444`) for errors/warnings.

### Elevation & Radius
- **Shadows:** Minimalist. Use `shadow-sm` and `border` (1px solid `zinc-800`) rather than heavy drop shadows to maintain a flat, modern technical aesthetic.
- **Border Radius:** `rounded-md` (0.375rem) for UI components. No extreme pill shapes. Keep it structured and enterprise.

### Motion & Animation
- **Philosophy:** Purposeful, not decorative.
- **Duration:** 150ms - 200ms for state changes (hover, focus).
- **Easing:** `ease-in-out` or `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Reduced Motion:** Strict enforcement of `@media (prefers-reduced-motion)`. All framer-motion animations must disable immediately.

### Iconography
- **Library:** Lucide React.
- **Weight:** 1.5px stroke width. Consistent sizing (`w-5 h-5` for inline, `w-6 h-6` for headers).

### Illustrations & Photography
- No stock photography.
- High-fidelity Mermaid C4 diagrams.
- Code snippets rendered with Shikiji for perfect syntax highlighting.
- Verified architecture schematics.


## COMPONENT SPECIFICATIONS

All components must be constructed using `shadcn/ui` primitives (Radix UI) and styled with Tailwind CSS to ensure complete WCAG 2.2 AA accessibility out of the box.

### 1. Navigation (Top Bar)
- **Purpose:** Primary global routing and command palette access.
- **States:**
  - `Scroll`: Glassmorphism (`backdrop-blur-md bg-zinc-950/80`) activates after 50px of Y-scroll.
  - `Mobile`: Hamburger menu transitions to a full-screen accessible modal (`Dialog`).
- **Responsive:** Hide inline text links on `sm`, show only on `md` and above.
- **SEO:** Wrap in `<nav>` semantic tag.

### 2. Footer
- **Purpose:** Secondary routing, legal compliance, and social proof.
- **Content:** Grid layout. Column 1: Brand/Logo. Column 2: Services. Column 3: Legal/Socials.
- **Structured Data:** Embed JSON-LD `Organization` or `Person` schema invisibly.

### 3. Hero Section
- **Purpose:** Immediate value proposition delivery.
- **Layout:** Two-column on `lg` (Text left, abstract architectural visualization right).
- **Animations:** Subtle fade-up on mount.
- **LCP Optimization:** No heavy imagery above the fold. Use pure CSS or highly compressed SVG.

### 4. Cards (Project, Service, Technology, Blog)
- **Purpose:** Uniform grid items for directory pages.
- **Variants:**
  - `ProjectCard`: Requires Image/Mockup header, Title, Metric Badge, Technology Tags, and a GitHub/Live Link.
  - `ServiceCard`: Icon-led, Title, Description, "Learn More" arrow.
  - `TechnologyCard`: Minimalist. Logo, Name, Proficiency Level.
- **Hover State:** `translate-y-[-2px] shadow-md border-zinc-700`.
- **Focus State:** `ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950`.
- **Accessibility:** Entire card must be clickable, but semantic HTML must ensure only one `<a>` tag exists per card (using pseudo-elements for clickable area).

### 5. Badges & Tags
- **Purpose:** Categorization (e.g., "Next.js", "Backend").
- **Variants:**
  - `Outline`: `border border-zinc-800 text-zinc-300`.
  - `Solid`: `bg-blue-500/10 text-blue-500`.
  - `Success`: `bg-green-500/10 text-green-500` (Used exclusively for live metrics or passing SLA).

### 6. Buttons
- **Variants:**
  - `Primary`: `bg-zinc-50 text-zinc-950 hover:bg-zinc-200`. (High contrast CTA).
  - `Secondary`: `border border-zinc-800 hover:bg-zinc-900`.
  - `Ghost`: `hover:bg-zinc-900 text-zinc-400`.
- **States:** `Disabled: opacity-50 cursor-not-allowed`. `Loading: Spinner + pointer-events-none`.

### 7. Code Blocks & Architecture Blocks
- **Purpose:** Displaying implementation details natively.
- **Implementation:** `shikiji` or `rehype-pretty-code`.
- **Features:** "Copy to Clipboard" button (with success toast), syntax highlighting, filename tab.
- **Responsive:** Horizontal scroll with `overflow-x-auto`. No line wrapping.

### 8. Testimonials / Metrics
- **Purpose:** Trust signaling.
- **Implementation:** Masonry grid or simple row. Must include explicit attribution or source document reference.

### 9. Forms (Contact)
- **Purpose:** Lead generation and project inquiries.
- **Validation:** Zod + React Hook Form. Client-side validation before server action.
- **States:** Error state outlines inputs in red (`ring-red-500`) with accessible error text below.
- **Security:** Honeypot fields or Turnstile (Cloudflare) to prevent spam without degrading UX.

### 10. Search (Command Palette)
- **Purpose:** Instant global navigation.
- **Trigger:** `CMD+K`.
- **Implementation:** `cmdk` (shadcn/ui).
- **Categories:** Projects, Services, Articles, Technologies.

### 11. Breadcrumbs
- **Purpose:** Hierarchical navigation and SEO.
- **Implementation:** `Schema.org/BreadcrumbList` mapped to UI text. E.g., `Home > Projects > AegisFlow`.

### 12. Empty States, Loading States, Skeletons, 404
- **Empty States:** "No articles found matching 'XYZ'." Clear "Clear Filters" CTA.
- **Loading:** `Skeleton` components mirroring the final UI shape. No spinners for full page loads.
- **404:** Brutalist, clean 404 page. "404 - Node Not Found in Graph." Back to Home CTA.

---

## SECTION SPECIFICATIONS

### Layout & Spacing
- Every distinct page section (e.g., Hero, Features, Testimonials) must be wrapped in a `<section>` tag with a clear `aria-label` or `aria-labelledby`.
- Vertical spacing between sections must be consistent: `py-16 md:py-24`.

### Loading Behaviour
- Sections below the fold must utilize lazy loading or React Server Components to prevent blocking the initial HTML payload. Images must include `loading="lazy"` and `decoding="async"`.


## PAGE & CONTENT SPECIFICATIONS

### 1. Home (`/`)
- **Purpose:** The digital lobby. Direct users instantly to their specific intent (Services, Projects, or Contact).
- **Business Goal:** Lead qualification.
- **User Goal:** Verify competence and technical depth.
- **SEO Goal:** Rank for "Principal AI Engineer", "Backend Architect".
- **Primary CTA:** "View Services" or "Consultation".
- **Hierarchy:** Hero -> Value Proposition -> Featured Projects (Top 3) -> Core Services -> Technical Writing (Latest Blog) -> Footer.

### 2. About (`/about`)
- **Purpose:** Personal narrative and professional history.
- **Content:** Translates the empirical CV (`knowledge/markdown/experience/`) into a compelling narrative.
- **Component Hierarchy:** Timeline component (mapping Transworld -> NovaSole -> AIHK), Skills Graph, Certifications Grid.

### 3. Projects Index (`/projects`)
- **Purpose:** Portfolio directory.
- **Content:** Grid of ProjectCards. Filterable by category (Frontend, Backend, AI).
- **Target Keywords:** "AI Engineering Portfolio", "Next.js Projects".

### 4. Project Detail (`/projects/[slug]`)
- **Purpose:** Deep dive into architectural decisions and business impact.
- **Content Hierarchy:**
  1. Title & High-Level Summary.
  2. Metrics Ribbon (e.g., "Latency: <500ms", "Revenue Impact: 10M PKR").
  3. The Problem (Business context).
  4. The Solution (Technical implementation).
  5. Architecture Diagram (Mermaid or SVG).
  6. Code Snippets (Core logic only).
  7. Tech Stack Tags.
- **Presentation Rules:** GitHub links must be prominent. If NDA applies, explicitly state "Architecture generalized due to NDA."

### 5. Services Index (`/services`)
- **Purpose:** The product catalog.
- **Content:** Grouped by Service Clusters (Enterprise AI, Scalable Backends, Cloud Ops).
- **Primary CTA:** "Discuss a Project" pointing to `/contact`.

### 6. Blog Index (`/blog`)
- **Purpose:** Content marketing and topical authority.
- **Content:** List of articles. Read time estimation. Topic tags.

### 7. Blog Detail (`/blog/[slug]`)
- **Purpose:** Prove expertise.
- **Writing Style:** Dense, highly technical, zero filler. Target audience is other Senior/Principal engineers.
- **Content Hierarchy:** Markdown parsed via MDX. Support for embedded React components (e.g., interactive charts).
- **Internal Linking:** Inline text must link to related Services and Projects.

### 8. Contact (`/contact`)
- **Purpose:** Conversion.
- **Content:** Zod-validated form. Name, Email, Project Description, Budget Range (dropdown).
- **Trust Builder:** "Typical response time: < 24 hours."

### 9. Technology Detail (`/technologies/[slug]`)
- **Purpose:** SEO programmatic pages.
- **Content:** Auto-generated based on the Knowledge Graph. (e.g., A page for "PostgreSQL" listing every project and job where PostgreSQL was utilized).

### 10. FAQ (`/faq`)
- **Purpose:** Handle objections and provide quick answers for recruiters.
- **Content:** Accordion component (`shadcn/ui`). Mapped from `schemas/faq.json`.

## CONTENT WRITING STYLE
- **Tone:** Authoritative, Empirical, Concise.
- **Reading Level:** 12th Grade / College (Technical).
- **Taboos:** Never use "I am passionate about..." or "I love coding." Use "I architected...", "I scaled...", "I deployed..."
- **Missing Information:** If an architectural diagram or specific metric is missing for a project, the UI should gracefully omit the component, rather than displaying "Information Required". However, for strict compliance documentation, explicitly state "Data unavailable."


## SERVICE SPECIFICATIONS (PART A)

*Note: As per strict policy, if a specific service lacks a public case study in the repository, it is explicitly marked with "No documented public case study currently available." However, the architectural blueprint is fully defined.*

### 1. Website Design (Full Stack)
- **Overview:** End-to-end architecture and deployment of modern, responsive web applications.
- **Business Problems:** Slow load times, poor conversion rates, inability to handle high traffic spikes.
- **Target Clients:** E-commerce (NovaSole scale), B2B SaaS.
- **Technology Stack:** Next.js (App Router), React, Tailwind CSS, TypeScript, shadcn/ui.
- **Architecture:** Static Generation (SSG) for content pages, Server Components (RSC) for dynamic data, Edge caching via Vercel/Cloudflare.
- **Deliverables:** Complete source code, Figma design system translation, CI/CD pipeline, Vercel deployment.
- **Evidence/Case Studies:** NovaSole (10M PKR sales, 500k visitors), AuraNode.

### 2. Backend Engineering
- **Overview:** Design and implementation of highly concurrent, fault-tolerant API layers and databases.
- **Business Problems:** Database deadlocks, API latency, microservice orchestration failures.
- **Technology Stack:** FastAPI, Python, PostgreSQL, Docker, Redis.
- **Architecture:** RESTful or GraphQL endpoints, JWT stateless authentication, connection pooling, background task queues (Celery/Redis).
- **Security:** Rate limiting, SQL injection prevention (ORM), HTTPS/TLS enforcement.
- **Evidence/Case Studies:** AegisFlow (FastAPI backend), NovaSole.

### 3. AI Engineering
- **Overview:** Bridging the gap between raw machine learning models and production-ready software applications.
- **Business Problems:** Integrating AI into legacy systems without breaking existing UX; managing LLM token limits and costs.
- **Technology Stack:** LangChain, LangGraph, OpenAI/Anthropic APIs, HuggingFace.
- **Architecture:** Agentic workflows with distinct routing nodes and fallback mechanisms.
- **Deliverables:** Containerized AI microservices, prompt management systems.
- **Evidence/Case Studies:** Self-Healing RAG (SHBRAG), VoiceRAG, LLM Guardrail.

### 4. Machine Learning
- **Overview:** Training, fine-tuning, and deploying bespoke statistical models for predictive analysis.
- **Business Problems:** Churn prediction, anomaly detection, personalized recommendations.
- **Technology Stack:** Scikit-learn, PyTorch, Pandas, Numpy.
- **Evidence/Case Studies:** *No documented public case study currently available.*

### 5. LLMs (Large Language Models)
- **Overview:** Enterprise deployment and fine-tuning of generative text models.
- **Business Problems:** Data privacy (needing local LLMs), context window limitations, slow generation speeds.
- **Technology Stack:** vLLM, Ollama, Llama.cpp, Groq.
- **Architecture:** Streaming responses (Server-Sent Events) to minimize Time To First Token (TTFT).
- **Evidence/Case Studies:** LLM Guardrail, VoiceRAG (using Groq for sub-500ms latency).

### 6. RAG (Retrieval-Augmented Generation)
- **Overview:** Grounding LLMs in private enterprise data to eliminate hallucinations.
- **Business Problems:** LLMs hallucinating company policies; inability of LLMs to access real-time secure databases.
- **Technology Stack:** Pinecone/Qdrant (Vector DBs), `text-embedding-3-small`, Cross-Encoders (`bge-reranker`).
- **Architecture:** CRAG (Corrective RAG) pipeline. Pre-filtering metadata -> Vector Search -> Reranking -> LLM Generation -> Output Guardrail.
- **Evidence/Case Studies:** Self-Healing RAG (SHBRAG), AegisFlow.

### 7. AI Automation
- **Overview:** Replacing manual human tasks with autonomous AI agents capable of tool use.
- **Business Problems:** High operational costs in customer support, manual data entry, and lead qualification.
- **Technology Stack:** LangGraph (Stateful agents), Model Context Protocol (MCP).
- **Architecture:** Directed Acyclic Graphs (DAG) mapping decision trees. Agents equipped with specific API tools (e.g., Salesforce lookup, Email dispatch).
- **Evidence/Case Studies:** Git Archaeologist (MCP Server).


## SERVICE SPECIFICATIONS (PART B)

### 8. Workflow Automation
- **Overview:** Connecting disparate SaaS applications via API orchestration.
- **Business Problems:** Manual data entry across platforms, human error in repetitive tasks.
- **Technology Stack:** Python, FastAPI, Webhooks, Celery, Make.com/n8n (for visual orchestrations).
- **Architecture:** Event-driven serverless functions triggered by Webhooks.
- **Evidence/Case Studies:** Transworld (Automated NOC Scripting, 18% SLA improvement).

### 9. Voice Agents
- **Overview:** Conversational AI capable of real-time voice synthesis and transcription.
- **Business Problems:** High latency in voice interactions causing robotic, unnatural conversations.
- **Technology Stack:** Groq (LPU), Whisper (STT), ElevenLabs (TTS), WebSockets.
- **Architecture:** Full duplex WebSocket connection streaming audio bytes to minimize perceived latency.
- **Evidence/Case Studies:** VoiceRAG (Sub-500ms latency).

### 10. Call Agents
- **Overview:** AI systems integrated directly into telephony networks (SIP/VoIP) to handle inbound/outbound calls.
- **Business Problems:** High call center overhead, inconsistent support quality.
- **Technology Stack:** Twilio/Vonage, Deepgram, FastAPI.
- **Architecture:** SIP trunking connected to a WebSocket media stream, processed by a low-latency LLM agent.
- **Evidence/Case Studies:** *No documented public case study currently available.*

### 11. WhatsApp Agents
- **Overview:** Autonomous AI bots deployed on the WhatsApp Business API.
- **Business Problems:** Low email open rates; customers preferring immediate chat over web portals.
- **Technology Stack:** Meta Graph API, FastAPI, LangChain.
- **Architecture:** Webhook listener receiving message payloads, processing via RAG, and dispatching responses asynchronously.
- **Evidence/Case Studies:** *No documented public case study currently available.*

### 12. Telegram Agents
- **Overview:** High-speed bots for crypto, alerts, and community management on Telegram.
- **Business Problems:** Managing large community groups or dispatching real-time trading alerts.
- **Technology Stack:** `python-telegram-bot`, Redis.
- **Evidence/Case Studies:** *No documented public case study currently available.*

### 13. Chatbots
- **Overview:** Web-based conversational interfaces.
- **Business Problems:** Offloading Tier-1 support tickets.
- **Technology Stack:** React, Socket.io, FastAPI, Pinecone.
- **Architecture:** Standard HTTP polling or WebSockets. Includes typing indicators and markdown rendering for rich text responses.
- **Evidence/Case Studies:** Self-Healing RAG (SHBRAG) Interface.

### 14. Data Analysis
- **Overview:** Extracting actionable business intelligence from raw datasets.
- **Business Problems:** "Data rich but information poor." Inability to visualize trends.
- **Technology Stack:** Pandas, Matplotlib, Jupyter, SQL.
- **Deliverables:** Cleaned datasets, interactive dashboards, written executive summaries.
- **Evidence/Case Studies:** *No documented public case study currently available.*

### 15. Technical Documentation
- **Overview:** Architecting enterprise-grade knowledge platforms and developer portals.
- **Business Problems:** Siloed tribal knowledge, impossible onboarding, unmaintainable Word documents.
- **Technology Stack:** Markdown, MDX, Nextra, Docusaurus, JSON Schema.
- **Architecture:** Docs-as-code. Content lives in Git repositories, validated via CI/CD, and deployed as static sites.
- **Evidence/Case Studies:** The Antigravity Platform (This exact repository; 23 schemas, 100+ Markdown files).


## AUDIENCE EXPERIENCES

### 1. The CTO / Engineering Manager Experience
- **Journey:** Lands on a deep-dive Blog Post -> Clicks to the implementing Project -> Reads Architecture -> Checks GitHub.
- **Pain Points:** Tired of "AI Wrappers" and developers who don't understand CI/CD, concurrency, or DB indexing.
- **Desired Information:** What is the specific database? How is state managed? How is deployment handled?
- **Trust Builders:** Mermaid C4 Diagrams, Shikiji Code Blocks, explicit mentions of Docker and PostgreSQL.
- **CTA:** "View GitHub Repository" or "Technical Consultation."

### 2. The Founder Experience
- **Journey:** Google Search ("AI automation for X") -> Service Page -> Case Study -> Contact.
- **Pain Points:** Needs to scale operations but cannot hire 50 new support staff. Needs a reliable technical partner, not just a freelancer.
- **Desired Information:** ROI. Speed of delivery. Can this person take an idea to production independently?
- **Trust Builders:** The "10M PKR sales" metric. The "500k visitors" scale. Professional, jargon-free business impact summaries.
- **CTA:** "Discuss a Project" (Lead capture form).

### 3. The Recruiter / Hiring Manager Experience
- **Journey:** LinkedIn Profile -> Website Homepage -> About / Timeline -> Projects.
- **Pain Points:** Sifting through hundreds of generic resumes. Needs to know *exactly* what this person built vs what their team built.
- **Desired Information:** Tech stack keywords (Next.js, Python), Years of Experience, specific job history.
- **Trust Builders:** Explicit Timeline (`/about`), verifiable Certification links, Downloadable PDF Resume button.
- **CTA:** "Download Resume" or "Message on LinkedIn."

### 4. The Client (Non-Technical) Experience
- **Journey:** Referral -> Homepage -> Services -> Contact.
- **Pain Points:** Burned by previous developers who delivered buggy, unmaintainable code.
- **Desired Information:** Will this solve my business problem?
- **Trust Builders:** Client testimonials (if available), clear step-by-step Development Process, SLA guarantees.
- **CTA:** "Book a Discovery Call."

---

## BLOG STRATEGY

### Categories & Series
1. **Architecture Deep Dives:** (Advanced) e.g., "Designing a Stateful RAG Agent with LangGraph."
2. **Performance Engineering:** (Advanced) e.g., "Optimizing FastAPI for Sub-500ms Voice Synthesis."
3. **Business of AI:** (Intermediate) e.g., "When to use a Vector DB vs standard SQL for Enterprise AI."
4. **Tutorials:** (Intermediate) Actionable code implementations.

### Structuring Articles for AEO (Answer Engine Optimization)
- **Introduction:** Must start with a "TL;DR" bulleted list to allow Perplexity/Claude to extract the core answer instantly.
- **Visuals:** Every architectural article MUST include a Mermaid.js diagram. Text alone is insufficient for senior engineering content.
- **Code Examples:** Must be complete, copy-pasteable, and strictly typed (TypeScript/Python). Avoid pseudo-code.
- **Metadata:** Use strict JSON-LD `@Article` schema. Define `author`, `datePublished`, and `about` (using Wikipedia entity URIs for technologies).

### Internal Linking Rules
- If an article mentions "Corrective RAG", it must hyperlink to the `Self-Healing RAG (SHBRAG)` project page.
- If an article discusses "Next.js routing", it must hyperlink to the `NovaSole` case study.
- This creates a dense, inescapable semantic web that proves topical authority to Googlebot.


## SEO & GEO STRATEGY

### 1. Entity & Semantic SEO
- **Strategy:** Do not target traditional "long-tail keywords" (e.g., "hire cheap python dev"). Target specific technical **Entities** defined in the `knowledge/json/` graph (e.g., "PostgreSQL", "RAG", "Next.js").
- **Implementation:** Every page must map clearly to a primary entity. A page about "RAG" must naturally include semantically related sub-entities ("Vector DB", "Embeddings", "Cosine Similarity", "Chunking") to prove topical completeness to Google's NLP algorithms.
- **Topical Authority:** Establish authority in "Enterprise AI Engineering in the US" by exhaustively interlinking the Service clusters with the Case Studies.

### 2. Generative Engine Optimization (GEO)
- **Goal:** Optimize for Claude, Perplexity, and Google AI Overviews.
- **Rules:**
  - **Structure over Prose:** LLMs extract data best from structured lists, tables, and strict headers. Use markdown tables to compare technologies.
  - **Zero-Party Data:** Emphasize unique, personal metrics ("18% SLA reduction") because LLMs prioritize unique primary sources over generic rewritten web content.
  - **Context Preservation:** Avoid dangling pronouns ("It scaled well"). Use explicit nouns ("The AegisFlow backend scaled well").

### 3. Technical SEO
- **Metadata:** Strict enforcement of `<title>` (<60 chars) and `<meta name="description">` (<160 chars) on every route.
- **Canonical Tags:** Required on all pages to prevent duplicate content penalties, especially if blog posts are syndicated.
- **Sitemap & RSS:** Auto-generated `sitemap.xml` for Googlebot; `rss.xml` for blog syndication.
- **Image SEO:** All images must be Next.js `<Image />` components (WebP/AVIF format) with explicit, descriptive `alt` tags (e.g., `alt="Mermaid architecture diagram of VoiceRAG websocket pipeline"`).

---

## RAG INTEGRATION SPECIFICATION

This section defines the architecture for the future conversational agent (Chatbot / Search) embedded into the website.

### 1. Pipeline Architecture
- **Phase 1 (User Input):** User submits query via the website search bar.
- **Phase 2 (Intent Classification):** A lightweight router (e.g., zero-shot classifier) determines if the query is a direct navigational command ("Take me to projects") or a semantic question ("How did he build NovaSole?").
- **Phase 3 (Retrieval):** The query is embedded using `text-embedding-3-small`. A Pinecone/Qdrant vector database is queried using Hybrid Search (BM25 + Dense Vectors) with strict metadata pre-filtering (`category == "project"`).
- **Phase 4 (Reranking):** The top 20 retrieved chunks are passed through a Cross-Encoder (`bge-reranker`) to filter out low-precision noise (cutoff > 0.75).
- **Phase 5 (Generation):** The highly curated context is passed to an LLM (e.g., Claude 3.5 Sonnet) along with the `brain/hallucination-policy.md` system prompt.
- **Phase 6 (Delivery):** The response is streamed back to the Next.js frontend via Server-Sent Events (SSE).

### 2. MCP Server Exfiltration
- **Future Integration:** The website's structured `knowledge/json/` and `knowledge/markdown/` directories must eventually be wrapped in an Express/FastAPI MCP Server. 
- **Capability:** This will allow users running Claude Desktop to natively connect to the "Musharraf Aziz Portfolio MCP" and query the resume directly from their local environment, establishing massive technical credibility.


## ACCESSIBILITY & ANIMATION

### Accessibility (WCAG 2.2 AA)
- **Keyboard Navigation:** Every interactive element must be reachable via `Tab`. A visible "Skip to Content" link must be provided for screen readers.
- **Focus Rings:** Custom outline styles (`ring-2 ring-blue-500`) must be explicitly defined. Never use `outline: none` without a fallback.
- **ARIA:** Use Radix UI primitives (via shadcn/ui) to ensure modals, dropdowns, and accordions automatically handle complex ARIA state and focus trapping.
- **Contrast:** Strict 4.5:1 text contrast ratio in both Light and Dark themes.
- **Semantic HTML:** Deep usage of `<article>`, `<aside>`, `<main>`, and `<time>` tags.

### Animation Specification
- **Theme:** Utilitarian and physical. No bouncy cartoon animations.
- **Library:** Framer Motion.
- **Page Transitions:** Immediate. Do not block page loads with slow 500ms fade-ins.
- **Micro-interactions:** Hover states on buttons/cards use standard CSS `transition-all duration-200`.
- **Reduced Motion:** If `@media (prefers-reduced-motion: reduce)` is true, all Framer Motion variables must default to `transition: { duration: 0 }`.

---

## PERFORMANCE SPECIFICATION

### Core Web Vitals
- **LCP (Largest Contentful Paint):** Target < 1.2s. Preload the hero text font. Do not use large background images.
- **FID/INP (Interaction to Next Paint):** Target < 100ms. Avoid heavy synchronous React `useEffect` blocks on hydration.
- **CLS (Cumulative Layout Shift):** Target 0. All images and skeletons must have explicit width and height attributes to reserve DOM space.

### Optimization Techniques
- **Image Optimization:** Next.js `<Image>` with `sizes` attributes for optimal responsive delivery.
- **Code Splitting:** Rely heavily on React Server Components (RSC) so heavy libraries (like Markdown parsers or database clients) never ship to the client bundle.
- **Lazy Loading:** `next/dynamic` for heavy client components (e.g., interactive D3 charts or Mermaid renders) below the fold.

---

## TECHNICAL IMPLEMENTATION

### Stack Decisions
- **Framework:** Next.js (App Router). Selected for its optimal hybrid rendering (SSG + RSC) and built-in SEO capabilities.
- **Language:** TypeScript. Strict mode enabled. Zod for runtime schema validation.
- **Styling:** Tailwind CSS v3/v4 for utility-first zero-runtime CSS.
- **Components:** `shadcn/ui` (Copy-paste Radix UI wrappers). No bloated NPM component libraries.
- **Content Parsing:** `next-mdx-remote` or `contentlayer` for parsing the `knowledge/markdown/` files into static pages.
- **Icons:** `lucide-react`.

### Deployment & Cost Architecture
- **Hosting:** Vercel Hobby tier or Cloudflare Pages.
- **Constraint Checklist:**
  - No paid CMS. (The `mak/knowledge` Git directory acts as the CMS).
  - No paid databases for static content. (Parsed at build time).
  - High traffic scaling is completely free because pages are statically generated (SSG) at build time and cached on the global CDN.

---

*This document marks the final, authoritative blueprint. Implementation may now commence safely without ambiguity.*


