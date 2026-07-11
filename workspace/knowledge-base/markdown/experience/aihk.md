---
id: exp_aihk_001
title: AI Engineer & Operations Manager at Allama Iqbal Hospital
category: Experience
description: Detailed breakdown of the AI engineering and operations role at Allama Iqbal Hospital Kasur.
aliases: [AIHK Role, Hospital AI Engineer]
tags: [experience, healthcare, ai engineer, rag, llm]
keywords: [Healthcare AI implementation, MS Presidio, zero hallucinations, clinical RAG]
created: 2026-07-08
updated: 2026-07-08
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
A dual-hat leadership and deep technical role focusing on the digital transformation of a major regional hospital. This role required bridging cutting-edge GenAI research with mission-critical healthcare operations where fault tolerance and data privacy are non-negotiable.

## Company
**Allama Iqbal Hospital Kasur (AIHK)**

## Industry
Healthcare / MedTech

## Employment Type
Full-Time

## Dates
**August 2024 – Present**

## Location
Kasur, Pakistan

## Responsibilities
- Architect and maintain enterprise-grade AI systems, specifically Multi-Agent LLM Workflows and Clinical Retrieval-Augmented Generation (RAG) systems.
- Design and enforce AI security protocols (Guardrail Gateways) to ensure compliance with medical data privacy standards (HIPAA principles).
- Manage cross-departmental hospital operations (10+ departments) through digital workflow automation.
- Monitor and evaluate LLM performance in production using rigorous CI/CD testing frameworks.

## Technical Stack
- **Languages:** Python, TypeScript
- **AI/ML:** LangGraph, LangChain, Groq, Llama 3, OpenAI, DeepEval
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
- Achieved and maintained **zero AI hallucinations** across **1,000+ daily interactions** for over 12 months.
- Reduced overall system downtime by **25%**.
- Drove an **18% efficiency gain** in administrative workflows.
- Awarded the **High Performance Excellence Award** (June 2025).

## Business Impact
The systems deployed fundamentally modernized the hospital's operations, reducing manual administrative overhead and ensuring medical staff had instantaneous, secure, and perfectly accurate access to clinical data, thereby improving patient throughput and safety.

## Recruiter Highlights
- Proven ability to deploy LLMs in highly regulated, high-risk environments (Healthcare).
- Demonstrated mastery of advanced agentic architectures (LangGraph) rather than simple wrapper scripts.
- Strong metric-driven impact (zero hallucinations, 25% downtime reduction).

## Interview Questions
- "How exactly did you achieve 'zero hallucinations' in a clinical setting? What was your evaluation framework?"
- "Walk me through the architecture of your LLM Guardrail Gateway. How did you handle latency while redacting PII?"

## STAR Story: The Zero Hallucination Mandate
- **Situation:** The hospital needed an AI query system for clinical protocols, but doctors were rightfully terrified of LLM hallucinations providing incorrect dosages or procedures.
- **Task:** Build a RAG system that was statistically incapable of returning false medical information.
- **Action:** I moved away from standard naive RAG. I implemented a Corrective RAG (CRAG) workflow using LangGraph, where a secondary evaluator LLM scores the retrieval documents for relevance *before* generation. I also built a CI/CD pipeline using DeepEval to run regression tests on 500+ golden medical queries on every git push.
- **Result:** The system has processed over 1,000 queries daily for 12 months without a single logged hallucination, winning the High Performance Excellence Award and gaining full trust from the medical board.
