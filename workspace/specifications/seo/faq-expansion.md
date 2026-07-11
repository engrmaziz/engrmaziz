# FAQ Expansion Strategy

The core `faq.md` contains 100 questions. To further optimize for Long-Tail SEO and AI Overviews, we will dynamically generate specialized FAQ modules for specific pages.

## Persona-Specific FAQs

### For Recruiters (Focus on Scale & Metrics)
- *Example:* "What is the largest concurrent user base you have supported?" (500k at NovaSole, 50k at Transworld).
- *Example:* "Have you managed teams?" (14-person TAC, 4-person NOC).

### For Founders (Focus on ROI & Speed)
- *Example:* "How quickly can you deploy a SaaS MVP?" (Next.js architecture enables 2-4 week robust deployments).
- *Example:* "Why should we pay for an AI architecture review?" (To prevent building a non-scalable wrapper that will need a rewrite in 6 months).

### For CTOs (Focus on Security & Architecture)
- *Example:* "How do you handle migrations in zero-downtime environments?"
- *Example:* "What is your fallback strategy if the primary LLM provider experiences an outage?"

## Industry-Specific FAQs

### Healthcare
- "How do you ensure Patient Data (PHI) doesn't leak into OpenAI's training data?"
- "What is the latency of your PII redaction gateway?"

### FinTech
- "How do you prevent background ML inference from blocking API endpoints?"
- "Can you enforce PCI-DSS standards at the database layer?"
