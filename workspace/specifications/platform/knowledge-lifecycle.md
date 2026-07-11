# Knowledge Lifecycle

This document defines how a piece of knowledge moves from inception to deprecation within the semantic graph.

## 1. Creation & Drafting
- New knowledge (e.g., a new project case study) must be drafted in a separate branch or workspace.
- It must adhere strictly to the YAML Schema defined in `platform/schemas/`.

## 2. Review & Verification
- **Automated Validation:** A CI/CD pipeline (e.g., GitHub Actions) runs `ajv` or a Python schema validator against the Markdown YAML to ensure all required fields (like `confidence` and `id`) are present.
- **Empirical Check:** Missing URLs or metrics flag the document for manual review (based on QA standards).

## 3. Publication
- The markdown file is merged into `main`.
- A webhook triggers the regeneration of the `knowledge-graph.json` and the vector database embeddings.

## 4. Archiving & Deprecation
- **Rule:** Never delete an entity (Skill, Service, Project) if it has incoming edges (other files linking to it).
- **Process:** If a technology (e.g., "AngularJS") becomes irrelevant, do NOT delete `skills/angularjs.md`. Instead, update the YAML front matter to `status: deprecated`. This prevents broken links in the graph while instructing the AI Assistant to stop recommending it for new projects.
