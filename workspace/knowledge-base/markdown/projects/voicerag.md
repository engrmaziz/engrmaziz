---
id: proj_voicerag_001
title: VoiceRAG Core v1
category: Project
description: Real-time, sub-500ms latency Voice AI integration for customer triage.
aliases: [Voice RAG, Voice AI Core]
tags: [project, ai, voice, websockets, langgraph]
keywords: [Vapi.ai integration, Retell AI, Low Latency WebSockets, Custom Voice AI]
created: 2026-07-08
updated: 2026-07-08
version: 1.0.0
confidence: High
source_documents: []
related_documents: []
related_projects: [self-healing-rag.md]
related_skills: [Django, LangGraph, WebSockets]
related_services: [AI Voice Agents & Conversational UI]
---
# VoiceRAG Core v1

**Source Code:** [GitHub Repository](https://github.com/engrmaziz/voice-rag)
## Executive Summary
VoiceRAG Core v1 is a production-grade backend designed to power real-time AI voice agents. It bridges high-quality Speech-to-Text (STT) and Text-to-Speech (TTS) providers with a LangGraph-orchestrated LLM backend, achieving human-like conversational latency (sub-500ms).

## Problem Statement & Business Context
Standard text-based LLM APIs are too slow for voice interactions. When users speak to an AI, any delay over 1 second feels unnatural and breaks trust. Customer support centers need AI that can converse seamlessly, interrupt intelligently, and query internal databases on the fly.

## Objectives
- Achieve end-to-end response latency under 500ms.
- Support real-time barge-in (interruption handling).
- Orchestrate complex logic (e.g., booking an appointment) during a live call.

## Solution Architecture

### High-Level Architecture
The system uses a WebSocket-first architecture. Audio streams directly from the frontend (or telephony provider like Twilio/Vapi) to the Django backend. The backend manages the LangGraph state, executing tools, and streams the LLM text output instantly to a TTS engine (like Deepgram/ElevenLabs), which streams audio back to the user.

### System Components
- **Telephony/Voice Gateway:** Vapi.ai / Retell AI.
- **Backend Orchestrator:** Django (Python) using Django Channels for ASGI WebSocket support.
- **Agent Logic:** LangGraph (Stateful multi-actor graph).
- **LLM:** Groq (LPU) for inference speed.

## Technology Stack
- **Frameworks:** Django, Django Channels, LangGraph.
- **Protocols:** WebSockets (WSS), WebRTC.
- **AI Models:** Groq Llama-3-70b-versatile, Deepgram (Nova-2 for STT).

## Challenges & Lessons Learned
- **Challenge:** LLM generation time was pushing latency above 1.5 seconds.
- **Solution:** Switched from blocking HTTP requests to full WebSocket streaming. We stream the LLM tokens directly to the TTS engine chunk-by-chunk, allowing the TTS to start generating audio before the LLM has finished the sentence.
- **Challenge:** Managing conversational state when the user interrupts the AI (barge-in).
- **Solution:** Used LangGraph to manage conversational state deterministically, allowing the graph execution to halt and recalculate if an interruption webhook fires.

## Recruiter Summary
Highlights extreme optimization skills. Building voice AI requires a deep understanding of asynchronous programming, WebSockets, and latency optimization—skills that place this candidate in the top tier of AI backend engineers.

## Interview Questions
- "How did you manage to get end-to-end Voice AI latency under 500ms?"
- "Explain how you handled 'barge-in' (interruptions) using LangGraph and WebSockets."


## Telemetry & Media Status
> [!NOTE]
> **Screenshots/Diagrams:** [Missing Source Information] - Visual assets have not been provided in the current repository.
> **Deployment Metrics:** Standard CI/CD deployment utilized. Explicit latency/throughput KPIs are documented only where explicitly provided in the core analysis.
