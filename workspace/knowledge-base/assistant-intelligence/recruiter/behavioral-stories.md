# Behavioral & STAR Stories

## 1. Handling Conflict & Stakeholder Management
- **Situation (S):** At Transworld Home, different departments (NOC, Field Operations, Management) often had conflicting priorities regarding SLA breaches.
- **Task (T):** Align the teams to reduce the overall fault resolution time for the 50k ISP user base.
- **Action (A):** Implemented a transparent, data-driven ticketing dashboard and initiated daily cross-departmental syncs. Rather than pointing fingers, focused on root-cause analysis (e.g., fiber cuts vs equipment failure).
- **Result (R):** Improved inter-departmental trust and successfully reduced fault resolution times by 18%.

## 2. Overcoming Technical Failure
- **Situation (S):** During the initial development of the Clinical AI system at AIHK, the LLM was hallucinating medical advice based on slightly irrelevant retrieved chunks.
- **Task (T):** Eliminate hallucinations to meet strict healthcare safety standards.
- **Action (A):** Scrapped the standard RAG pipeline. Rebuilt the architecture using LangGraph to implement a Corrective RAG (CRAG) flow. Added a self-reflection node that evaluates chunk relevance before generation, falling back to a safe "I don't know" state if confidence was low.
- **Result (R):** Achieved zero hallucinations in production, restoring stakeholder trust in the AI system.
