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

## Key Features
- **Inbound Sanitization**: Applies Regex-based PII masking and heuristic jailbreak blocking.
- **Upstream Governance**: Injects dynamic system prompts and forces provider-native JSON response modes.
- **Outbound Validation**: Enforces output against JSON schemas with lightweight auto-repair capabilities.
- **Compliance Telemetry**: Writes asynchronous `.jsonl` audit trails capturing request latency and security outcomes.

## Solution Architecture
### System Flow
1. **Inbound Sanitization:** Prompts are validated against `config.yaml` guardrails to strip PII and block instruction-override phrases.
2. **Upstream Governance:** The proxy connects asynchronously via `httpx.AsyncClient` to the LLM (e.g., Groq API), injecting a strict JSON-mode system prompt.
3. **Outbound Validation:** The raw string output is parsed, validated against required schema keys (e.g., `status`, `message`, `data`), and auto-repaired if necessary.
4. **Audit Logging:** Every lifecycle event is recorded in an append-only `audit_trail.jsonl`.

## Technology Stack
| Layer | Technology |
|-------|-----------|
| **Framework** | FastAPI (Python) |
| **HTTP Client** | HTTPX (Async) |
| **NLP/Security** | Regex Heuristics, MS Presidio, spaCy |
| **LLM Provider** | Groq API |
| **Testing** | Custom ASCII Security Dashboard via `test_gateway.py` |

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



