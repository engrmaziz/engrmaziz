# README Style Guide

## Design Decisions

### Visual Philosophy
The README follows a **Minimalist Architect** approach inspired by Stripe, Vercel, and Cloudflare engineering documentation. High whitespace. Zero clutter. Maximum information density per line.

### Why No Emojis
Emojis signal a student or early-career portfolio. At the Staff/Principal level, the profile must read like an engineering capability statement, not a personal blog. Clean typography communicates seniority.

### Why No Visitor Counter
Competitive research shows visitor counters are associated with junior profiles. They add no signal for CTOs or technical recruiters.

### Collapsible Sections
Tech Stack and Professional Experience are wrapped in `<details>` tags. This keeps the above-fold area focused on the narrative (About, Philosophy, Architecture) while making detailed data available on demand. Recruiters scanning on mobile benefit significantly from this pattern.

### Badge Strategy
Two rows of badges, split by purpose:
- **Row 1:** Core production stack (Python → GitHub Actions) — signals what this person builds with daily.
- **Row 2:** AI & Platform layer (LangGraph → Open Source) — signals specialization and deployment targets.

All badges use `style=for-the-badge` for consistent height and readability at small sizes. Every `shields.io` URL uses the static badge format which never breaks.

### Mermaid Diagram Selection

| Diagram | Type | Rationale |
|---------|------|-----------|
| Deterministic AI Stack | `graph TD` | Top-down flow matches how engineers read system architectures. Subgraphs group concerns cleanly. |
| Corrective RAG Pipeline | `flowchart LR` | Left-to-right flow shows the sequential decision pipeline. The Pass/Fail branch is the key differentiator. |
| Voice AI Communication | `sequenceDiagram` | The only correct diagram type for real-time multi-party communication. Shows the streaming nature explicitly. |
| Development Lifecycle | `stateDiagram-v2` | Cyclic state machines demonstrate process maturity. The Monitoring→Research loop signals continuous improvement. |

### Project Selection
5 projects were chosen based on differentiation power, not recency:

1. **Self-Healing RAG** — demonstrates the hardest unsolved problem in enterprise AI (hallucination elimination)
2. **LLM Guardrail Gateway** — security/compliance is extremely rare in portfolios and signals enterprise readiness
3. **VoiceRAG** — real-time systems with sub-500ms latency demonstrate optimization skills few engineers possess
4. **AegisFlow** — FinTech with PyTorch proves capability beyond LLM wrappers
5. **Git Archaeologist MCP** — published open-source tool on a bleeding-edge protocol signals forward-thinking

AuraNode and dentl2 were deliberately excluded. E-commerce and dental SaaS are less differentiated at the Staff+ level.

### Typography
- `#` H1 used only once (name)
- `##` H2 for major sections
- `###` H3 for subsections and project titles
- Bold for emphasis within paragraphs
- Tables for structured data
- Blockquotes only for the publication citation

### Color Palette (Badge Colors)
All colors are sourced from the official brand guidelines of each technology. No custom or arbitrary colors are used, ensuring recognition at a glance.

### Contact Section
Structured as a table rather than a bullet list. Tables are faster to scan and render better on mobile GitHub. Email is included because `knowledgebase.json` lists it as the canonical contact method, and recruiter conversion requires a direct email option.
