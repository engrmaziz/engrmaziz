# Internal Linking Graph

Internal linking distributes "link equity" and establishes semantic relationships for Google bots and LLM crawlers. The following explicit linking rules must be followed when building the final Knowledge Platform.

## 1. Project ↔ Skill Linking Rule
**Rule:** Every technology mentioned in a project file must hyperlink back to the dedicated Skill page, and vice versa.
- *Example:* In `aegisflow.md`, the mention of "Next.js" links to `skills/frontend.md#nextjs`.
- *Example:* In `skills/ai-ml.md`, the mention of "LangGraph" links to `projects/voicerag.md`.

## 2. Project ↔ Service Linking Rule
**Rule:** Projects act as the evidence layer for Service pages.
- *Example:* `services/ai-solutions.md` must contain a "Featured Projects" section linking to `projects/self-healing-rag.md` and `projects/llm-guardrail.md`.
- *Example:* At the bottom of `projects/auranode.md`, include a Call-To-Action (CTA): "Need a high-performance Next.js platform? View my [SaaS Development Services](/services/saas-development)."

## 3. Experience ↔ Certification Linking Rule
**Rule:** Leadership and consulting roles must be backed by authoritative credentials.
- *Example:* In `experience/transworld.md`, mentions of "Workflow Optimization" should link to the `certifications/mckinsey-forward.md` program.

## 4. Pillar ↔ Cluster Linking Rule
**Rule:** Strict hierarchical linking to prevent orphaned pages.
- The Pillar page links out to *every* Cluster page.
- Every Cluster page links back to the Pillar page using the exact primary keyword as the anchor text (e.g., "Back to Enterprise AI Engineering").
- Cluster pages can link horizontally to sibling clusters only if highly relevant (e.g., linking a Next.js tutorial to a Supabase tutorial).
