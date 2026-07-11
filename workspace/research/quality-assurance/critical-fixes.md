# Critical Fixes (Immediate Action Required)

These issues must be resolved before the knowledge base is compiled into a public-facing website or fed into a live conversational AI.

## 1. Inject Verification Links
- **Issue:** The portfolio lacks empirical proof of code quality and deployment.
- **Fix:** Update all `projects/*.md` files with direct URLs to the live applications, or public GitHub repositories. If a project is proprietary (e.g., AIHK), explicitly state `[Source Code: Proprietary / NDA]` to remove ambiguity.

## 2. Delineate "I" vs "We"
- **Issue:** Corporate projects (Transworld, NovaSole) lack explicit boundary definitions between Musharraf's solo engineering work and the broader team's output.
- **Fix:** Update the experience files to include a strict `Individual Contribution` section to prevent the AI Assistant from accidentally claiming credit for another team member's work.

## 3. Update Knowledge Graph Schema
- **Issue:** The `.graphml` file lacks a relationship edge between Companies and Industries.
- **Fix:** Add an `OPERATES_IN` edge to `knowledge-graph.graphml` connecting `Company` nodes to `Industry` nodes.
