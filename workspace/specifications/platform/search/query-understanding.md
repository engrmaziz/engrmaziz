# Query Understanding & Intent

Before hitting the Vector DB, the system must parse the user's intent to route the query to the correct search modality.

## Intent Classifications
1. **Navigational (Entity Search):** "What is AegisFlow?" -> Route to Graph DB or exact match Keyword search.
2. **Informational (Semantic):** "How do you handle high database loads?" -> Route to Dense Vector search.
3. **Transactional (Actionable):** "Generate a cover letter for a backend role." -> Route to MCP Prompts or Agentic pipeline.

## Implementation via LLM Gateway
A lightweight LLM call (or a fast classifier like zero-shot BART) should intercept incoming queries and tag them with `{ intent: 'semantic', entities: ['database'] }` to dynamically construct the hybrid retrieval payload.
