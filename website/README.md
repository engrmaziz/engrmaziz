# Antigravity Website Portfolio & Enterprise RAG Engine

This is the Next.js production codebase for Musharraf Aziz's professional portfolio and AI Engineering showcase.

---

## 🛠 Tech Stack
*   **Frontend & Routing**: Next.js 15 (App Router, Server Actions, Client Components)
*   **Styling**: Vanilla CSS (Tailored glassmorphism, responsive designs)
*   **Database & Vectors**: Supabase, PostgreSQL, `pgvector`
*   **Vector Embeddings**: Jina Embeddings v4 (1024-dimension MRL truncation)
*   **Reranking**: Jina Rerank v2 API / Multi-Factor Local Fallback
*   **LLM Inference**: Groq LPU Inference (GPT-OSS models)

---

## 🔍 RAG Infrastructure CLI Commands

Our system includes production CLI commands to index, monitor, and query the knowledge base locally:

### 1. Ingestion Crawl Indexer
Crawls all markdown files under `../workspace/knowledge-base/markdown/` and index them into the database:
```bash
npm run rag:index
```

### 2. Check System Health & Metrics
Query the database metrics, active embedding model details, and latency pings:
```bash
npm run rag:status
```

### 3. Context Search Tool
Test hybrid search queries and examine relevance scoring:
```bash
npm run rag:search "Your technical search query here"
```

---

## 📂 Architecture Guides
For detailed documentation on the RAG system pipelines, Reciprocal Rank Fusion formulas, element chunkers, semantic caching, and logs, see [RAG_ARCHITECTURE.md](docs/RAG_ARCHITECTURE.md).
