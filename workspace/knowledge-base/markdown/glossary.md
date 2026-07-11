---
id: glossary_001
title: Enterprise Glossary of Technical Terms
category: Glossary
description: Comprehensive definitions of all acronyms, frameworks, and technologies used across the knowledge base.
aliases: [Terminology, Tech Stack Definitions]
tags: [glossary, definitions, architecture, ai, web]
keywords: [RAG definition, Next.js meaning, LLM architecture terms]
created: 2026-07-08
updated: 2026-07-08
version: 1.0.0
confidence: High
source_documents: []
related_documents: [knowledgebase.md]
related_projects: []
related_skills: []
related_services: []
---

# Enterprise Glossary of Technical Terms

This glossary defines the critical technologies, architectural patterns, and acronyms referenced throughout the knowledge base to ensure clarity for non-technical stakeholders and AI agents.

## Artificial Intelligence & Machine Learning

- **CRAG (Corrective Retrieval-Augmented Generation):** An advanced RAG architecture where retrieved documents are evaluated by a lightweight LLM. If the documents are deemed irrelevant to the user's query, the system rejects them and triggers a web search or fallback mechanism, preventing hallucinations.
- **DeepEval:** An open-source framework used in CI/CD pipelines to quantitatively evaluate LLM outputs (e.g., scoring faithfulness, answer relevancy, and hallucination rates) against a set of golden test cases.
- **Groq / LPU (Language Processing Unit):** A specialized hardware accelerator designed specifically for inference, capable of generating LLM tokens significantly faster (e.g., 800+ tokens per second) than traditional GPUs.
- **LLM (Large Language Model):** A foundation model (like GPT-4 or Llama 3) trained on massive amounts of text data, capable of understanding and generating human-like text.
- **LangChain:** A framework for developing applications powered by language models, focusing on chaining together prompts, models, and retrieval systems.
- **LangGraph:** An extension of LangChain designed for building highly controllable, stateful, multi-actor (agentic) applications using graph theory (nodes and edges).
- **MCP (Model Context Protocol):** An open standard that enables AI models (like Claude) to securely connect to local and remote data sources, tools, and environments via standard JSON-RPC over stdio or HTTP.
- **RAG (Retrieval-Augmented Generation):** A technique where an LLM is provided with specific, retrieved documents (usually from a vector database) as context before it generates an answer, anchoring its response in factual data.
- **Vector Database (ChromaDB, Qdrant):** A database optimized to store and query high-dimensional mathematical representations (vectors or embeddings) of text, enabling semantic similarity search.

## Web Development & Software Engineering

- **FastAPI:** A modern, high-performance web framework for building APIs with Python, utilizing standard Python type hints for automatic validation and documentation.
- **Next.js:** A React framework that provides hybrid static and server rendering, TypeScript support, smart bundling, and route pre-fetching out of the box.
- **PostgreSQL:** An advanced, enterprise-class open-source relational database system known for its reliability, feature robustness, and performance.
- **React Server Components (RSC):** A Next.js feature allowing components to render exclusively on the server, reducing the amount of JavaScript sent to the client and improving performance.
- **Supabase:** An open-source Firebase alternative providing a Postgres database, Authentication, instant APIs, Edge Functions, and Realtime subscriptions.
- **Three.js:** A cross-browser JavaScript library and API used to create and display animated 3D computer graphics in a web browser using WebGL.

## Cloud, DevOps & Infrastructure

- **CI/CD (Continuous Integration / Continuous Deployment):** The practice of automating the building, testing, and deployment of code changes (e.g., using GitHub Actions) to ensure rapid and reliable software delivery.
- **Docker:** A platform that uses OS-level virtualization to deliver software in packages called containers, ensuring consistent environments from development to production.
- **Vercel:** A cloud platform for static sites and Serverless Functions, heavily optimized for frontend frameworks like Next.js.
- **WebSockets (WSS):** A communications protocol providing full-duplex communication channels over a single TCP connection, essential for real-time applications like Voice AI.

## Business & Operations

- **HIPAA (Health Insurance Portability and Accountability Act):** US legislation that provides data privacy and security provisions for safeguarding medical information.
- **NOC (Network Operations Center):** A centralized location where IT or telecom administrators supervise, monitor, and maintain a network.
- **PII / PHI (Personally Identifiable Information / Protected Health Information):** Any data that could potentially identify a specific individual or their medical history. Must be heavily protected or redacted in software systems.
- **SLA (Service Level Agreement):** A commitment between a service provider and a client regarding measurable aspects of the service, such as uptime (e.g., 99.95%) or response times.
