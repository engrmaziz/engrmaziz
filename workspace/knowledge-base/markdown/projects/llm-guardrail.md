---
id: proj_llmguardrail_001
title: LLM Guardrail Gateway
category: Project
description: An API gateway that intercepts and redacts PII/PHI from LLM prompts and enforces output schemas.
aliases: [AI Guardrails, PII Redaction API]
tags: [project, ai, security, healthcare, fastapi]
keywords: [HIPAA compliant AI, MS Presidio, LLM security, Prompt Injection defense]
created: 2026-07-08
updated: 2026-07-08
version: 1.0.0
confidence: High
source_documents: []
related_documents: [aihk.md]
related_projects: []
related_skills: [FastAPI, Python, MS Presidio, spaCy]
related_services: [Enterprise AI Solutions (LLMs, Agents, RAG), Technical Consulting & Architecture Review]
---
# LLM Guardrail Gateway

**Source Code:** [GitHub Repository](https://github.com/engrmaziz/LLM-GUARDRAIL-GATEWAY)
## Executive Summary
The LLM Guardrail Gateway is a critical security infrastructure component designed for healthcare environments. It acts as a reverse proxy between internal applications and external LLM APIs (like OpenAI), automatically detecting and redacting Personally Identifiable Information (PII) and Protected Health Information (PHI) before it leaves the internal network.

## Problem Statement & Business Context
Hospitals (like AIHK) want to use advanced LLMs to summarize patient histories, but sending raw medical records to external API providers is a direct violation of HIPAA and GDPR. Relying on users to manually anonymize data is too risky.

## Objectives
- Automatically identify and redact 18+ types of PII/PHI in milliseconds.
- Detect and block prompt injection attacks.
- Ensure all LLM outputs conform to a strict, safe JSON schema before returning to the client application.

## Solution Architecture
Built as a highly concurrent FastAPI microservice. Incoming requests are processed through a pipeline:
1. **Input Validation:** Blocks malicious payloads.
2. **Redaction Engine:** Uses Microsoft Presidio (backed by spaCy NLP models) to identify entities (Names, SSNs, Medical IDs, Locations). It replaces them with placeholders (e.g., `<PERSON_1>`).
3. **LLM Invocation:** Sends the clean prompt to the LLM.
4. **Re-identification (Optional):** Maps the placeholders back to the original entities on the secure internal network before returning the response to the doctor.

## Technology Stack
- **Framework:** FastAPI, Python.
- **NLP/Security:** Microsoft Presidio, spaCy, Guardrails AI.
- **Infrastructure:** Dockerized, deployed behind an Nginx reverse proxy on local hardware.

## Challenges & Lessons Learned
- **Challenge:** NLP models (like spaCy) can add 300-500ms of latency to every request.
- **Solution:** Optimized the spaCy pipeline by stripping out unnecessary components (like the dependency parser) and only running the Named Entity Recognition (NER) module.
- **Challenge:** Handling false positives in medical terminology.
- **Solution:** Implemented custom Presidio recognizers using Regex specifically tailored for Pakistani medical ID formats and local terminology.

## Recruiter Summary
Demonstrates a deep understanding of enterprise constraints. While many developers can call an OpenAI endpoint, this project proves Musharraf understands how to do it securely, legally, and at scale within highly regulated industries.

## Interview Questions
- "How does Microsoft Presidio actually identify PII, and how did you optimize its latency in your gateway?"
- "Explain the process of Re-identification. How do you return a coherent summary to the user if the names were stripped before sending to the LLM?"


## Telemetry & Media Status
> [!NOTE]
> **Screenshots/Diagrams:** [Missing Source Information] - Visual assets have not been provided in the current repository.
> **Deployment Metrics:** Standard CI/CD deployment utilized. Explicit latency/throughput KPIs are documented only where explicitly provided in the core analysis.
