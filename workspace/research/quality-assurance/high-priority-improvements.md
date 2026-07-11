# High-Priority Improvements (Missing Metrics)

To elevate the portfolio from a "B" (Narrative-based) to an "A+" (Empirically-based) architecture, the following data points must be retrieved from past work and injected into the documentation.

## 1. Financial & Cost Metrics
- What was the monthly AWS / Vercel / Supabase bill for NovaSole during the 500k visitor spike?
- What is the Groq LPU API cost for VoiceRAG Core v1?

## 2. Exact Latency Metrics
- Break down the VoiceRAG sub-500ms latency:
  - STT (Speech-to-Text) duration?
  - LLM Generation (Time to First Token)?
  - TTS (Text-to-Speech) duration?

## 3. Operations Metrics
- For Transworld Home: What was the exact SLA baseline before and after the 18% reduction? (e.g., "Reduced resolution time from 4 hours to 3.2 hours").
- For Ihsan Solar: How many API requests does the NOC automation handle daily?
