---
id: exp_aihk_001
title: AI Engineer & Operations Manager at Allama Iqbal Hospital
category: Experience
description: Detailed breakdown of the AI engineering and operations role at Allama Iqbal Hospital Kasur.
aliases: [AIHK Role, Hospital AI Engineer]
tags: [experience, healthcare, ai engineer, rag, llm]
keywords: [production RAG, MS Presidio, zero hallucinations, voice agents, WhatsApp, Twilio]
rag_priority: 11
created: 2026-07-08
updated: 2026-09-16
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
August 2024 – July 2026. Musharraf was AI Engineer and Operations Manager at Allama Iqbal Hospital Kasur (AIHK). He shipped production voice and WhatsApp RAG agents on Groq Llama 3.3 70B (Twilio, LangChain, n8n, MCP, Presidio) handling 1,000+ daily interactions. The engagement ended in July 2026 when he moved to Cygnus Technologies. This is the production AI proof behind call agents, chatbots, and RAG work — not a clinical-only hospital story.

## Company
**Allama Iqbal Hospital Kasur (AIHK)**

## Industry
Production AI / Operations platforms

## Employment Type
Full-Time

## Dates
**August 2024 – July 2026**

## Location
Kasur, Pakistan

## Responsibilities
- Designed and deployed an agentic AI CallBot on Llama 3.3 70B served through Groq, with OpenAI and Gemini as additional providers, reachable over WhatsApp and inbound phone calls through Twilio, handling more than 1,000 daily interactions in production.
- Built and optimised a LangChain RAG pipeline grounding agent responses in operational knowledge, with prompt engineering to reduce hallucinated or incorrect answers.
- Built agent workflows connecting the AI system to internal databases, REST APIs, and messaging platforms through a 16-node n8n pipeline, and built a Model Context Protocol server giving agents structured, tool-based access to external systems.
- Monitored agent output and decision quality over time, reviewing real interactions to identify failure patterns, building lightweight evaluation checks, and refining retrieval logic and prompts.
- Hardened the agent against low-confidence or incorrect outputs using fallback handling and data governance controls, including PII detection and redaction with spaCy and Microsoft Presidio, applied before any data reached the language model.
- Deployed and hosted AI services on Microsoft Azure for close to two years, covering compute, storage, and model hosting.
- Built OCR-based document processing using Tesseract and PaddleOCR, extracting structured data from scanned documents for downstream automation.
- Built PyTorch LSTM networks for time-series forecasting in a live inference pipeline.

## Technical Stack
- **Languages:** Python, TypeScript
- **AI/ML:** LangChain, Groq, Llama 3.3 70B, OpenAI, Gemini
- **Backend:** FastAPI, Node.js
- **Databases:** PostgreSQL, ChromaDB (Vector)
- **Security:** Microsoft Presidio (PII Redaction)
- **Cloud:** Microsoft Azure
- **Automation:** n8n (16-node parallel execution)
- **OCR:** Tesseract, PaddleOCR

## Architecture & Systems Worked On
1. **Production RAG knowledge base:** Internal search and retrieval so operations staff can query protocols and guidelines with grounded answers.
2. **LLM Guardrail Gateway:** A middle-layer API that intercepts outgoing LLM requests, redacts PII using NLP (spaCy/Presidio), and enforces output formatting.
3. **Voice and WhatsApp agents:** Agentic CallBot on Llama 3.3 70B via Groq, Twilio inbound voice, and WhatsApp, handling 1,000+ daily production interactions.

## Business Problems & Solutions
- **Problem:** High risk of LLM hallucinations in a production agent answering operational questions.
  - **Solution:** Implemented Corrective RAG (CRAG) and CI/CD evaluation pipelines (faithfulness scoring) to keep a verifiable zero-hallucination rate.
- **Problem:** Operational bottlenecks across 10+ departments from disconnected systems.
  - **Solution:** Deployed highly parallelized n8n automation workflows to synchronize data between legacy systems.

## Achievements & KPIs
- Achieved **1,000+ daily interactions** across WhatsApp and voice in production.
- Awarded the **High Performance Excellence Award** (June 2025).

## Business Impact
The systems reduced manual administrative overhead and gave operations staff grounded, governed access to internal knowledge through production RAG, voice, and chat agents.

## Recruiter Highlights
- Proven ability to deploy LLMs in high-stakes production environments with evals and PII redaction.
- Demonstrated mastery of agentic architectures (LangChain/LangGraph, MCP, n8n) rather than simple wrapper scripts.
- Strong metric-driven impact (1,000+ daily production interactions, High Performance Excellence Award).

## Interview Questions
- "How exactly did you achieve zero hallucinations in production RAG? What was your evaluation framework?"
- "Walk me through the architecture of your LLM Guardrail Gateway. How did you handle latency while redacting PII?"

## STAR Story: The Zero Hallucination Mandate
- **Situation:** Operations needed an AI query and call/chat system over internal knowledge, but leadership would not accept hallucinated answers.
- **Task:** Build a RAG and agent stack that failed closed instead of inventing.
- **Action:** Moved away from naive RAG. Implemented a Corrective RAG (CRAG) workflow where a secondary evaluator scores retrieved documents for relevance before generation. Built a CI/CD pipeline using DeepEval to run regression tests on 500+ golden queries on every git push. Added Presidio redaction before any payload reached the LLM.
- **Result:** The system processed 1,000+ interactions daily in production, winning the High Performance Excellence Award (June 2025). The role concluded in July 2026.
