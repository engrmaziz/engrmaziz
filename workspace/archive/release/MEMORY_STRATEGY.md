# AI Memory Strategy (Executive Summary)

To optimize vector database costs and LLM context windows, knowledge is segmented by its "volatility."

## The Strategy
Stable data (degrees, past jobs) is embedded once. Dynamic data (current project metrics) is updated via high-frequency RAG or real-time API tools.

**For the authoritative implementation policies, please see the canonical directory:**
👉 [`mak/memory/`](../memory/)

*Key canonical files include:*
- [Memory Classification](../memory/memory-classification.md)
- [Stable Memory](../memory/stable-memory.md)
- [Future Memory Policy](../memory/future-memory-policy.md)
