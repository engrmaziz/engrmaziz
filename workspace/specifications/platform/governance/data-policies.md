# Data Integrity & Governance Policies

This document establishes the boundaries of what is permissible within the knowledge base.

## 1. Truth & Evidence Rule
- **Policy:** No technology, skill, or project may be added to the knowledge base without verifiable evidence.
- **Enforcement:** A `github_url` or `deployed_url` is mandatory for projects. If a project is proprietary/NDA, it must be explicitly tagged as `is_nda: true` in the YAML, which instructs the AI Assistant to decline answering deep technical architecture probes regarding that specific codebase.

## 2. Quantitative Metric Rule
- **Policy:** Narrative claims of scale or performance ("fast", "large", "many") must be accompanied by a quantitative integer ("sub-500ms", "14 people", "500k visitors").
- **Enforcement:** Manual code review during PRs must flag ambiguous claims.

## 3. PII & Secret Prevention
- **Policy:** The knowledge base is designed to be public-facing and ingestible by third-party LLMs. It must never contain actual API keys, private internal IP addresses of previous employers, or unredacted client financial data.
- **Enforcement:** Automated secret-scanning tools (e.g., GitGuardian) must run on the repository before any merge to `main`.
