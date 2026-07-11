# Antigravity Enterprise Knowledge Platform

This repository serves as the definitive, machine-readable "Brain" for Musharraf Aziz.
It is an Enterprise Knowledge Graph designed to power Portfolio Websites, RAG pipelines, and MCP autonomous agents.

## Repository Philosophy
1. **Immutable Evidence:** All raw files are stored in `source/`.
2. **Canonical Knowledge:** The structured text resides in `knowledge/`.
3. **The Constitution:** The AI behavior is governed by `brain/`.
4. **Validation:** Every change is validated against JSON Schemas in `schemas/`.

## Architecture Flow

```mermaid
flowchart TD
    subgraph Data Layer
        A[source/] -->|Extract| B[knowledge/markdown/]
        A -->|Extract| C[knowledge/json/]
    end
    
    subgraph Logic Layer
        B --> D[rag/ Chunking]
        C --> E[schemas/ Validation]
    end
    
    subgraph AI Layer
        D --> F[brain/ Policies]
        E --> F
        F --> G[mcp/ Server]
        F --> H[assistant-intelligence/]
    end
    
    subgraph Applications
        G --> I[Claude Agent]
        H --> J[Next.js Portfolio]
    end
```

## Folder Tree
- `assets/` - Diagrams, logos, architecture
- `automation/` - Sync & extraction scripts
- `brain/` - The Constitution (Policies)
- `evaluation/` - QA, DeepEval, Hallucination testing
- `governance/` - Repository guardrails
- `knowledge/` - Markdown narratives and JSON graphs
- `mcp/` - Model Context Protocol server configuration
- `prompts/` - Original interaction prompts
- `rag/` - Chunking, embedding, retrieval strategies
- `schemas/` - Draft 2020-12 validation structures
- `source/` - Immutable root files

## Update Workflow
Please refer to `governance/` for specific workflows.
