# Advanced Search Architecture

The future retrieval system for this knowledge base will not rely on simple vector similarity (which is prone to hallucinations). It will utilize a **Hybrid RAG Architecture**.

## Components
1. **Dense Vector Search:** Embeddings (e.g., text-embedding-3-small) generated from the raw markdown chunks. Excellent for semantic intent ("Find me high performance web apps").
2. **Sparse Keyword Search (BM25):** Excellent for exact match entity queries ("PostgreSQL", "CRAG", "HIPAA").
3. **Graph Traversal:** Navigating the `knowledge-graph.json` to find deterministic relationships (e.g., finding all projects linked to "NovaSole" via the `WORKED_AT` edge).

## The Pipeline
1. **Query Intent Classification:** Is this a keyword query or a semantic query?
2. **Pre-Filtering:** Use YAML metadata to narrow the search space (e.g., `category: Project`).
3. **Hybrid Retrieval:** Retrieve Top K from Vector + Top K from BM25.
4. **Reranking:** Use a Cross-Encoder to re-score the combined results before feeding them to the LLM.
