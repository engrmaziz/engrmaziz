# Repository Structure and Governance

Welcome to the organized workspace for this project. This repository is maintained by a senior engineering team and follows a strict, two-directory root structure. This approach ensures long-term scalability, maintainability, and clarity for AI-assisted development.

## Root Directories

The root directory (`/`) must remain extremely clean. The only acceptable contents at the root level are essential Git and configuration files (e.g., `README.md`, `.gitignore`, `LICENSE`) and the following two primary directories:

- `website/`: The production Next.js application codebase.
- `workspace/`: The central hub for all documentation, research, and non-production assets.

**What should never be placed at the root:** Loose scripts, temporary notes, unused folders, assets, or arbitrary documents.

---

## Workspace Subdirectories

The `workspace/` directory contains several carefully structured subdirectories. Adhere to these guidelines to maintain an enterprise-grade environment.

### 1. `source-material/`
**Purpose:** Stores all external inputs, reference documents, and raw materials.
**What belongs here:** Resumes, CVs, raw text dumps, original certifications, company PDFs, external reports, scripts, icons, logos, and external data sets.
**What should never be placed here:** Generated content, finalized specifications, or production code.

### 2. `knowledge-base/`
**Purpose:** Acts as the unified brain of the repository. Stores clean, organized, and formatted knowledge that serves as a single source of truth for AI agents and human developers.
**What belongs here:** Registries, indices, assistant-intelligence profiles, domain knowledge (e.g., service descriptions, structured skill trees, certifications).
**What should never be placed here:** Raw unstructured notes or temporary scratchpads.

### 3. `specifications/`
**Purpose:** Holds technical, architectural, and business requirements.
**What belongs here:** Master specifications (like `website-master-specification.md`), UI/UX documentation, SEO strategy, governance policies, RAG/architecture blueprints, and platform schemas.
**What should never be placed here:** Historical logs, unvetted ideas, or outdated project plans.

### 4. `prompts/`
**Purpose:** A dedicated collection of structured AI prompts.
**What belongs here:** System prompts, conversation guidelines, zero-shot templates, and AI chain-of-thought protocols.
**What should never be placed here:** AI outputs or conversation transcripts.

### 5. `research/`
**Purpose:** Documenting findings, evaluations, audits, and exploratory work.
**What belongs here:** Competitor analysis, SEO audits, QA reports, duplicate analysis, and architecture assessment logs.
**What should never be placed here:** The actual production implementation or canonical rulesets.

### 6. `archive/`
**Purpose:** A graveyard for outdated, superseded, or obsolete files that must be kept for historical context but removed from active workflows.
**What belongs here:** Old release notes, deprecated features, obsolete documentation, and retired scripts.
**What should never be placed here:** Active development documents or files that are frequently updated.

### 7. `notes/`
**Purpose:** A place for general planning, daily scratchpads, and unstructured thoughts.
**What belongs here:** Meeting notes, quick brainstorms, to-do lists, and temporary outlines.
**What should never be placed here:** Finalized specifications or content meant for production.

---

## Future Maintenance Guidelines

To maintain an enterprise-grade repository, follow these rules:

1. **Strict Placement:** Before creating any new file or folder, consult this document. Place it in the single most logical directory.
2. **No Duplication:** Never create duplicate files. Use cross-referencing (internal markdown links) when a file relates to multiple domains.
3. **Clean Root:** Do not litter the root directory. If a tool outputs a configuration file in the root unexpectedly, verify if it can be reconfigured to a deeper directory or move it appropriately.
4. **Periodic Pruning:** Regularly review `notes/` and `research/` and archive outdated documents into `archive/`.
5. **AI-Assisted Consistency:** AI tools interacting with this repository must read this file to understand the expected conventions before making structural changes.
