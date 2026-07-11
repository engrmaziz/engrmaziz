# Future Architectural Enhancements

These are long-term recommendations for scaling the knowledge platform itself.

## 1. Automated Knowledge Graph Generation
Currently, `knowledge-graph.json` is statically written. In the future, deploy an LLM pipeline that runs over the `knowledge-base/` on every Git Commit to dynamically rebuild the JSON and GraphML files, ensuring the graph never falls out of sync with the markdown text.

## 2. Multi-Vector RAG Retrieval
Instead of just embedding the markdown chunks, implement a multi-vector architecture.
- Extract all bulleted lists and embed them separately.
- Extract all metrics (numbers) and embed them separately.
- Map them back to the Parent document. This drastically improves the AI Assistant's ability to answer highly specific quantitative questions.

## 3. The Interactive Interviewer MCP
Convert the `recruiter/` directory into a dedicated Model Context Protocol (MCP) server. Instead of just answering questions, the MCP server could *interview the recruiter*, extracting their tech stack requirements and dynamically generating a customized PDF resume on the fly.
