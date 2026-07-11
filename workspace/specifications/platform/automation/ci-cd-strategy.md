# CI/CD Automation Strategy

To maintain enterprise-grade reliability, updates to the knowledge base should be protected by automated validation pipelines.

## Proposed GitHub Actions Pipeline

### 1. Schema Validation Step
When a PR is opened targeting `main`:
- A script runs `ajv` (Another JSON Validator) or a Python equivalent against every markdown file.
- It parses the YAML front matter and validates it against the specific schema in `platform/schemas/`.
- **Fail Condition:** Missing required fields (e.g., `github_url` for a project, or a typo in a `related_services` array).

### 2. Broken Link Checker
- A script traverses the markdown AST looking for relative links (e.g., `[FastAPI](../skills/fastapi.md)`).
- **Fail Condition:** The destination file does not exist (HTTP 404 equivalent).

### 3. Graph Synchronization
- Upon successful merge to `main`, a workflow automatically rebuilds `knowledge-graph.json` and `knowledge-graph.graphml` to reflect the new state of the repository, preventing the structural graph from drifting out of sync with the text.
