# Ranking & Reranking Strategy

## The Recall vs Precision Problem
Vector embeddings are excellent at *Recall* (finding loosely related concepts) but poor at *Precision* (identifying exact matches, like "React" vs "React Native").

## Cross-Encoder Implementation
To fix this, the future search API must implement a Cross-Encoder reranking step (e.g., `bge-reranker-large`).

1. **Phase 1 (Bi-Encoder):** Retrieve the Top 20 chunks from the Vector DB (fast, high recall).
2. **Phase 2 (Cross-Encoder):** Pass the user's exact query + the 20 chunks into the Cross-Encoder. The model assigns a precise relevance score (0.0 to 1.0) to each pair.
3. **Phase 3 (Cutoff):** Only feed chunks with a score > 0.75 into the final LLM Context Window.

## Benefit
This guarantees that the final AI Assistant (e.g., the Recruiter Bot) only sees highly relevant, verified data, drastically lowering hallucination rates.
