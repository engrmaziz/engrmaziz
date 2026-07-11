# Search Intents Map

This document categorizes potential user queries by intent, difficulty, and commercial value, mapping them to the specific documents in the knowledge base that should fulfill them.

## 1. Informational Intent (High Volume, Low Commercial)
Users are looking for definitions, architectures, or how-to guides.

- **Query:** "How to prevent LLM hallucinations?"
  - *Mapped Target:* `projects/self-healing-rag.md`, `faq.md (Q1, Q13)`
  - *Required Context:* Corrective RAG, Evaluation pipelines.
- **Query:** "FastAPI vs Django for AI APIs"
  - *Mapped Target:* `faq.md (Q21)`, `projects/aegisflow.md`
  - *Required Context:* Asynchronous processing (ASGI), typing, latency.

## 2. Navigational Intent (Recruiter / Fact-Checking)
Users are looking for specific facts about Musharraf Aziz's background.

- **Query:** "Did Musharraf work at NovaSole?"
  - *Mapped Target:* `experience/novasole.md`
  - *Required Context:* Role (Software Engineer & IT Manager), duration, achievements (500k scale).
- **Query:** "What certifications does Musharraf have?"
  - *Mapped Target:* `certifications/*`
  - *Required Context:* Google AI, Anthropic, PyTorch, McKinsey, PEC.

## 3. Commercial Intent (High Value, Low Volume)
Clients looking to hire for a specific problem.

- **Query:** "Hire LangGraph developer for custom AI agent"
  - *Mapped Target:* `services/ai-solutions.md`, `projects/voicerag.md`, `skills/ai-ml.md`
  - *Required Context:* Proof of deploying LangGraph in production, understanding of state machines.
- **Query:** "HIPAA compliant LLM gateway development"
  - *Mapped Target:* `projects/llm-guardrail.md`, `services/ai-solutions.md`
  - *Required Context:* Microsoft Presidio, spaCy, local deployment, PII redaction.
- **Query:** "Next.js Supabase SaaS developer"
  - *Mapped Target:* `services/saas-development.md`, `projects/auranode.md`
  - *Required Context:* App Router, Row-Level Security, Core Web Vitals.

## 4. Evaluative Intent (Technical Due Diligence)
CTOs or senior engineers verifying technical depth.

- **Query:** "How to handle database locks during high traffic sales?"
  - *Mapped Target:* `faq.md (Q59)`, `experience/novasole.md`
  - *Required Context:* Decoupling inventory checks, message queues, static generation.
- **Query:** "Memory leak prevention in Three.js React"
  - *Mapped Target:* `projects/dentl2.md`
  - *Required Context:* Frustum culling, WebGL context disposal on unmount.
