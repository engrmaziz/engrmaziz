# Changelog

All notable changes to the schemas, metadata rules, and structural architecture of this knowledge platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enterprise AI Platform directory (`platform/`).
- JSON Schemas (Draft 2020-12) for all 20+ entities.
- MCP and API readiness maps.

### Changed
- Migrated from unstructured markdown to strict schema-validated YAML front matter across the entire `knowledge-base/` (Phase 1 completion).

### Deprecated
- `related_documents` in favor of explicit `related_projects`, `related_skills`, and `related_services` for stricter graph traversal.

## [1.0.0] - 2026-07-08
### Added
- Initial creation of the Canonical Professional Knowledge Base.
- SEO, Graph, and Assistant Intelligence enhancements.
