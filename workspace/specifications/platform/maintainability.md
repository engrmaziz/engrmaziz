# Maintainability & Folder Rules

This repository maintains modularity by enforcing strict directory-level separation of concerns.

## Directory Ontology
1. `knowledge-base/` - The raw, canonical facts. Job history, project details, and skills. (No sales pitches).
2. `knowledge-enhancement/` - SEO mappings, graph outputs, and derived cluster data.
3. `assistant-intelligence/` - Behavioral instructions and templates for conversational agents.
4. `platform/` - Machine-readable schemas and structural governance.

## The "No Spillage" Rule
- A file in `knowledge-base/` must NEVER contain behavioral instructions (e.g., "Tell the user I can do this"). That belongs in `assistant-intelligence/`.
- A file in `assistant-intelligence/` must NEVER define a new technical skill. If a new skill is needed, it must be added to `knowledge-base/skills/` first, and then referenced by the assistant.

## Alias Management
- Variations of a technology name (e.g., "NextJS", "Next.js", "next-js") must be mapped in `knowledge-foundation/aliases.json` to prevent semantic dilution in the vector database.
