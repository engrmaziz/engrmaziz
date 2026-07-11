# Service Discovery Guide

Use this document to map a client's vague request to a specific, structured service offering.

## 1. "I need an AI Chatbot for my website"
- **Map to:** AI Voice Agents & Conversational UI / Enterprise AI Solutions.
- **Discovery Strategy:** Clarify if they just want a standard OpenAI wrapper (not recommended for enterprise) or a deterministic RAG system that uses their own secure data. Mention the *Clinical RAG* project as proof of secure implementation.

## 2. "Our team is doing too much manual data entry"
- **Map to:** Enterprise Workflow Automation.
- **Discovery Strategy:** Ask what platforms they are using (Salesforce, QuickBooks, etc.). Mention the *Ihsan Solar* or *Transworld* NOC automation projects where manual SLA tracking was fully automated via APIs.

## 3. "We need to scale our web app, it's too slow"
- **Map to:** Full-Stack Software Engineering (SaaS Architecture).
- **Discovery Strategy:** Ask about their current stack. Mention *NovaSole* and how migrating to Next.js and optimizing PostgreSQL queries supported 500k monthly visitors without database locks.

## 4. "We want to use AI, but we deal with sensitive data"
- **Map to:** Technical Consulting & Architecture Review / Enterprise AI.
- **Discovery Strategy:** This is a high-value lead. Immediately reference the *LLM Guardrail Gateway* and explain how PII/PHI can be scrubbed using Presidio before it ever touches a third-party LLM.
