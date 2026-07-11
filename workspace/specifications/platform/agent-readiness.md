# Agent Readiness (Context & Chunking Rules)

To ensure this knowledge base can be effectively ingested by autonomous AI Agents (LangChain, LlamaIndex), the following text architectures are enforced.

## 1. Information Density & Chunking
- **Rule:** A single paragraph should not exceed 100 words.
- **Why:** Chunking algorithms (e.g., `RecursiveCharacterTextSplitter` with chunk size 500) perform best when natural paragraph breaks align closely with chunk sizes. Overly long paragraphs lead to truncated context mid-sentence.

## 2. Context Independence
- **Rule:** Avoid dangling pronouns at the start of sections.
- **Incorrect:** "It resulted in a 20% increase." (If chunked here, the agent doesn't know what "It" is).
- **Correct:** "The API automation at Ihsan Solar resulted in a 20% increase in fault resolution speed."

## 3. Explicit Metric Association
- **Rule:** Always pair a metric directly with the entity it describes within the same sentence.
- **Why:** This prevents hallucinations where an LLM mistakenly applies the "500k visitors" metric to the wrong project during a combined RAG retrieval.
