# Platform Versioning Strategy

This repository utilizes a dual-track versioning system to maintain stability for AI agents and API consumers.

## 1. Schema Versioning (Strict SemVer)
Any changes to the structural definition of data (e.g., adding a new required field to `projects.md` YAML, or updating `schemas/project.json`) must follow Semantic Versioning (SemVer 2.0.0).

- **MAJOR (v2.0.0):** Breaking changes. E.g., Changing `related_projects` to `project_links`, which would break an existing GraphQL resolver or MCP tool.
- **MINOR (v1.1.0):** Backwards-compatible additions. E.g., Adding an optional `github_url` field to a project.
- **PATCH (v1.0.1):** Backwards-compatible bug fixes. E.g., Fixing a regex validation rule in a schema.

## 2. Knowledge Versioning (Content Tracking)
Content (the actual markdown text) updates rapidly and does not require SemVer. Instead, it relies on strict YAML metadata tracking.

- Every markdown file MUST contain `updated: YYYY-MM-DD`.
- Every markdown file MUST contain `version: X.Y.Z` mapping to the schema version it complies with.

## 3. Deprecation Policy
If a schema field is deprecated (e.g., merging two legacy skills), the field must remain in the schema marked as `"deprecated": true` for at least one MAJOR version cycle before removal, giving downstream RAG pipelines time to migrate.
