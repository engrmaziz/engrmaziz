# The Enterprise Knowledge Graph

## What is this?
This document provides a human-readable summary of the underlying `knowledge-graph.json` and `knowledge-graph.graphml` files. It defines the core entity structure that powers the AI Knowledge Platform. By transforming flat markdown files into a structured graph, we enable semantic search engines, LLMs, and RAG pipelines to perform complex reasoning across your professional history.

## Graph Schema

### Node Types (Entities)
1. **Person:** The root node (Musharraf Aziz).
2. **Company:** Organizations you have worked for (AIHK, NovaSole, Transworld, Ihsan Solar, Sybrid).
3. **University:** Educational institutions (COMSATS).
4. **Project:** Software systems built (AegisFlow, SHBRAG, VoiceRAG, AuraNode, dentl2, Git MCP, LLM Guardrail).
5. **Service:** Commercial offerings (AI Solutions, SaaS Development, Automation, Consulting).
6. **Technology:** Programming languages, frameworks, and databases (Python, Next.js, FastAPI, LangGraph, Qdrant).
7. **Certification:** Verifiable credentials (Google AI, Anthropic, PyTorch LFS116, McKinsey, PEC).
8. **Industry:** Vertical markets served (Healthcare, FinTech, E-Commerce, Solar).

### Edge Types (Relationships)
1. `WORKS_AT` / `WORKED_AT`: Connects Person to Company.
2. `EDUCATED_AT`: Connects Person to University.
3. `CREATED`: Connects Person to Project.
4. `PROVIDES`: Connects Person to Service.
5. `HOLDS`: Connects Person to Certification.
6. `USES`: Connects Project to Technology.
7. `DEMONSTRATED_BY`: Connects Service to Project.
8. `SERVES`: Connects Project/Service to Industry.

## Why a Knowledge Graph Matters for AI

Standard RAG (Retrieval-Augmented Generation) relies on semantic similarity. If a user asks "Show me your Python projects", a naive RAG system searches for the word "Python".

By utilizing a Knowledge Graph:
1. The AI understands that `FastAPI` is a child of `Python`.
2. It sees that `AegisFlow` `USES` `FastAPI`.
3. It concludes that `AegisFlow` is a Python project, even if the word "Python" isn't the primary keyword in the AegisFlow document.

This deterministic reasoning is critical for AI Recruiter Assistants and AI Client Assistants, ensuring they provide accurate, intelligent answers rather than simple keyword matches.
