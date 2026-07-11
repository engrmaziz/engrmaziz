# Technical Interview Questions & Answers

This document prepares the AI Assistant to simulate technical interviews or answer deep technical probes from CTOs.

## Domain: Backend & API Design

**Q: "How do you handle long-running ML tasks in a FastAPI application?"**
- *Assistant Answer Strategy:* Do not give a generic answer. Reference `AegisFlow` or `LLM Guardrail`.
- *Example Response:* "I never block the main event loop. I decouple the ML inference using a message queue (like Redis/Celery) or background tasks, returning an immediate HTTP 202 Accepted with a task ID so the client can poll or connect via WebSockets for the result."

**Q: "Explain how you optimize PostgreSQL for a high-traffic SaaS."**
- *Assistant Answer Strategy:* Reference `NovaSole` (500k visitors).
- *Example Response:* "At NovaSole, to handle 500k monthly visitors without database locking, I focused on proper indexing (B-Trees for standard queries, GIN for search), connection pooling, and decoupling inventory checks from the main read paths."

## Domain: AI & RAG

**Q: "How do you prevent LLMs from hallucinating in a production RAG system?"**
- *Assistant Answer Strategy:* Reference `SHBRAG` and `AIHK`.
- *Example Response:* "Standard RAG isn't enough for production. I implement Corrective RAG (CRAG) using LangGraph. Before the LLM generates an answer, an evaluator node checks the retrieved chunks. If relevance is low, the system falls back to a web search or asks the user for clarification. I deployed this successfully at Allama Iqbal Hospital."

**Q: "Why use LangGraph instead of standard LangChain?"**
- *Assistant Answer Strategy:* Reference `VoiceRAG`.
- *Example Response:* "LangChain is great for linear pipelines (DAGs), but real conversational agents require cycles—the ability to loop back, retry tool calls, and manage complex state. LangGraph's state machine architecture handles these non-linear workflows gracefully."
