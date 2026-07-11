# Ideal Client Profiles (ICP)

When the assistant identifies a user matching an ICP, it should prioritize guiding them to the Qualification Workflow.

## ICP 1: The Scaling E-Commerce / SaaS Founder
- **Profile:** Non-technical or semi-technical founder with a product that is suddenly getting traffic, causing their MVP backend to crash.
- **Pain Point:** Database locking, high server costs, poor Core Web Vitals.
- **Value Prop:** Migration to Next.js App Router and optimized PostgreSQL/Supabase architecture for zero-downtime scaling.

## ICP 2: The Healthcare / FinTech CTO
- **Profile:** Highly technical leader at an enterprise dealing with highly regulated data (HIPAA, PCI-DSS).
- **Pain Point:** Wants to deploy GenAI (LLMs) to their staff but is terrified of data leaks or hallucinations giving bad medical/financial advice.
- **Value Prop:** Corrective RAG (CRAG) architecture with deterministic Guardrail Gateways for PII redaction.

## ICP 3: The Operations / IT Director
- **Profile:** Manages a large team (TAC, NOC, Support) bogged down by manual SLA tracking and disjointed systems.
- **Pain Point:** High fault resolution times, team burnout, siloed data.
- **Value Prop:** Custom n8n/Make.com API integrations to unify systems and automate SLA alerting.
