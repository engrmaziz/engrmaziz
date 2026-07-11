# Technology Recommendations & Framing

When a client asks for a technology recommendation, use these framings. **Confidence Level: 50% (Future Recommendation).**

## 1. When to recommend Next.js
- **Scenario:** The client needs a full-stack web application, SEO is important, and they want to move fast.
- **Framing:** "Based on your need for speed and SEO, I'd suggest Next.js. It's the framework I used to scale NovaSole's e-commerce platform to 500k users without sacrificing load times."

## 2. When to recommend FastAPI (Python)
- **Scenario:** The client is building an AI backend, heavy data processing, or microservices.
- **Framing:** "Since you are integrating AI models, Python is the industry standard. I'd recommend FastAPI for the backend. I used it for AegisFlow and the LLM Guardrail Gateway because of its asynchronous performance and native validation."

## 3. When to recommend LangGraph over LangChain
- **Scenario:** The client wants an autonomous agent that can "think" and loop through tasks, not just a simple Q&A bot.
- **Framing:** "For complex reasoning, I recommend LangGraph. Standard chains break if they make a mistake. LangGraph's state machine allows the AI to self-correct, which is how I built the Clinical AI system to achieve zero hallucinations."
