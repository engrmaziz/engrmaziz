---
id: exp_aihk_001
title: AI Engineer & Operations Manager at Allama Iqbal Hospital
category: Experience
description: Detailed breakdown of the AI engineering and operations role at Allama Iqbal Hospital Kasur.
aliases: [AIHK Role, Hospital AI Engineer]
tags: [experience, healthcare, ai engineer, rag, llm]
keywords: [Healthcare AI implementation, MS Presidio, zero hallucinations, clinical RAG]
created: 2026-07-08
updated: 2026-08-25
version: 1.0.0
confidence: High
source_documents: []
related_documents: [timeline.md, rag-index.md]
related_projects: [voice-rag_README.md, LLM-GUARDRAIL-GATEWAY_README.md]
related_skills: [LangGraph, Python, FastAPI, MS Presidio]
related_services: [Enterprise AI Solutions (LLMs, Agents, RAG)]
---

# AI Engineer & Operations Manager

## Overview
A dual-hat leadership and deep technical role focusing on the digital transformation of a major regional hospital. This role required bridging cutting-edge GenAI research with mission-critical healthcare operations where fault tolerance and data privacy are non-negotiable. The engagement ended in July 2026 when Musharraf moved to Cygnus Technologies.

## Company
**Allama Iqbal Hospital Kasur (AIHK)**

## Industry
Healthcare / MedTech

## Employment Type
Full-Time

## Dates
**August 2024 – July 2026**

## Location
Kasur, Pakistan

## Responsibilities
- Designed and deployed an LLM-powered AI agent using OpenAI, Gemini, and Groq-hosted Llama 3.3 70B, with a RAG pipeline built in LangChain, integrated into a multi-channel patient platform handling 1,000+ daily interactions.
- Built agent workflows that integrate with APIs, internal databases, and messaging platforms, using a 16-node n8n automation system to connect the AI agent to real business systems.
- Built and published a Model Context Protocol server, giving AI agents structured, tool-based access to external systems.
- Monitored agent output and decision quality over time, reviewing real interactions to identify failure patterns and refining prompt design and retrieval logic to improve reliability.
- Hardened the agent system against failures, including low-confidence or incorrect outputs, using fallback handling and data governance controls before any data reached the LLM.
- Wrote Python for data processing, API integration, and structured output handling supporting the agent's decision-making pipeline.

## Technical Stack
- **Languages:** Python, TypeScript
- **AI/ML:** LangChain, Groq, Llama 3.3 70B, OpenAI, Gemini
- **Backend:** FastAPI, Node.js
- **Databases:** PostgreSQL, ChromaDB (Vector)
- **Security:** Microsoft Presidio (PII Redaction)
- **Automation:** n8n (16-node parallel execution)

## Architecture & Systems Worked On
1. **Clinical RAG Knowledge Base:** An internal search and retrieval system that allows medical staff to query protocols and guidelines instantaneously.
2. **LLM Guardrail Gateway:** A middle-layer API that intercepts all outgoing LLM requests, redacts PHI/PII using NLP (spaCy/Presidio), and enforces output formatting.
3. **Voice AI Triage:** (Described in `VoiceRAG`) A voice-based agent for routing and answering initial patient inquiries.

## Business Problems & Solutions
- **Problem:** High risk of AI hallucinations leading to dangerous medical misinformation.
  - **Solution:** Implemented Corrective RAG (CRAG) and strict CI/CD evaluation pipelines (Faithfulness scoring) to achieve a verifiable "zero hallucination" rate.
- **Problem:** Operational bottlenecks across 10+ hospital departments causing delayed patient care.
  - **Solution:** Deployed highly parallelized n8n automation workflows to synchronize data between legacy systems.

## Achievements & KPIs
- Achieved **1,000+ daily interactions** on a multi-channel patient platform in production.
- Awarded the **High Performance Excellence Award** (June 2025).

## Business Impact
The systems deployed fundamentally modernized the hospital's operations, reducing manual administrative overhead and ensuring medical staff had instantaneous, secure, and perfectly accurate access to clinical data, thereby improving patient throughput and safety.

## Recruiter Highlights
- Proven ability to deploy LLMs in highly regulated, high-risk environments (Healthcare).
- Demonstrated mastery of advanced agentic architectures (LangGraph) rather than simple wrapper scripts.
- Strong metric-driven impact (1,000+ daily production interactions, High Performance Excellence Award).

## Interview Questions
- "How exactly did you achieve 'zero hallucinations' in a clinical setting? What was your evaluation framework?"
- "Walk me through the architecture of your LLM Guardrail Gateway. How did you handle latency while redacting PII?"

## STAR Story: The Zero Hallucination Mandate
- **Situation:** The hospital needed an AI query system for clinical protocols, but doctors were rightfully terrified of LLM hallucinations providing incorrect dosages or procedures.
- **Task:** Build a RAG system that was statistically incapable of returning false medical information.
- **Action:** I moved away from standard naive RAG. I implemented a Corrective RAG (CRAG) workflow using LangGraph, where a secondary evaluator LLM scores the retrieval documents for relevance *before* generation. I also built a CI/CD pipeline using DeepEval to run regression tests on 500+ golden medical queries on every git push.
- **Result:** The system processed 1,000+ queries daily in production, winning the High Performance Excellence Award (June 2025) and gaining trust from the medical board. The role concluded in July 2026.
