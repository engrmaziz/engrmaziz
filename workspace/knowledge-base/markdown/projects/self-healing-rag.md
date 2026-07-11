---
id: proj_shbrag_001
title: Self-Healing RAG Pipeline (SHBRAG)
category: Project
description: An advanced AI infrastructure project ensuring resilient, hallucination-free retrieval.
aliases: [SHBRAG, Self Healing RAG]
tags: [project, ai, rag, vector-database, langchain]
keywords: [Enterprise RAG Architecture, Corrective RAG, ChromaDB, LangChain Developer]
created: 2026-07-08
updated: 2026-07-08
version: 1.0.0
confidence: High
source_documents: []
related_documents: [rag-index.md]
related_projects: [llm-guardrail-gateway.md]
related_skills: [FastAPI, Qdrant, LangChain, Groq]
related_services: [Enterprise AI Solutions (LLMs, Agents, RAG)]
---
# Self-Healing RAG Pipeline (SHBRAG)

**Source Code:** [GitHub Repository](https://github.com/engrmaziz/Self-Healing-RAG-Pipeline)
## Executive Summary
The Self-Healing Retrieval-Augmented Generation (SHBRAG) pipeline is an advanced AI backend designed to guarantee high-fidelity LLM outputs. It employs Corrective RAG (CRAG) methodologies to actively evaluate, reject, and rewrite retrieved context before it reaches the final generation LLM, effectively driving hallucination rates to zero.

## Problem Statement & Business Context
Standard RAG systems are brittle. If the vector search returns irrelevant documents, the LLM will hallucinate an answer based on bad data. For enterprise use cases (like Healthcare or Legal), providing a confidently wrong answer is worse than providing no answer at all.

## Objectives
- Build a RAG system that evaluates its own retrieval quality.
- Fallback to web search or alternative data sources if local retrieval fails.
- Maintain fast generation times (using Groq LPUs) despite multiple LLM evaluation hops.

## Solution Architecture

### High-Level Architecture
1. **Query Routing:** Classifies the user query intent.
2. **Retrieval:** Fetches top-k documents from Qdrant.
3. **Grading (The "Healing" phase):** A lightweight LLM evaluates if the documents actually answer the query. 
4. **Correction:** If rejected, the system rewrites the query and searches external APIs (Tavily/SerpAPI).
5. **Generation:** The final context is passed to the generation LLM.

### System Components
- **Framework:** LangChain (Custom DAG implementation).
- **LLMs:** Groq (Llama 3) for ultra-fast intermediate grading; OpenAI (GPT-4o) for complex final generation.
- **Vector Database:** Qdrant (chosen for its advanced filtering and speed).
- **Backend:** FastAPI wrapper to expose the pipeline as a REST service.

## Data Processing & Embeddings
- **Chunking:** Semantic chunking with 512 token limits and 50 token overlap.
- **Embeddings:** OpenAI `text-embedding-3-small`.
- **Retrieval:** Hybrid search combining dense vectors and BM25 sparse vectors.

## Challenges & Lessons Learned
- **Challenge:** The grading step added significant latency, making the API feel sluggish.
- **Solution:** Switched the grading LLM from GPT-4 to Groq (LPU), reducing the evaluation step latency from 1.2 seconds to 180ms.
- **Lesson:** In multi-hop RAG systems, use the smallest, fastest model possible for deterministic classification tasks (like grading), reserving heavy models only for the final synthesis.

## Recruiter Summary
Demonstrates advanced knowledge of AI architectures beyond simple API wrappers. By implementing Corrective RAG (CRAG), Musharraf solves the hardest problem in enterprise AI—hallucinations—making him highly valuable to companies dealing with sensitive data.

## Interview Questions
- "Explain the concept of 'Self-Healing' in your RAG pipeline. What happens when the vector database returns irrelevant context?"
- "Why did you choose Qdrant over Pinecone or ChromaDB for this specific project?"


## Telemetry & Media Status
> [!NOTE]
> **Screenshots/Diagrams:** [Missing Source Information] - Visual assets have not been provided in the current repository.
> **Deployment Metrics:** Standard CI/CD deployment utilized. Explicit latency/throughput KPIs are documented only where explicitly provided in the core analysis.
