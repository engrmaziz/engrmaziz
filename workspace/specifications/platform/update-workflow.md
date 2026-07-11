# Update Workflow

Follow this strict procedure when adding new information to the knowledge base to ensure the semantic graph and AI context remain unbroken.

## Adding a New Project
1. **Schema Check:** Review `platform/schemas/project.json` to understand the required YAML fields.
2. **Create Markdown:** Create `knowledge-base/projects/new-project.md`.
3. **Populate Metadata:** Fill out the YAML front matter. 
   - *CRITICAL:* The `id` must be unique (e.g., `proj_newname_001`).
   - You MUST include a `github_url` or `deployed_url` to satisfy empirical proof rules.
4. **Link Entities:** Under `related_skills`, explicitly name skills that already exist in `knowledge-base/skills/`. Do not invent new skill spellings (e.g., use "Next.js", not "NextJS").
5. **Update JSON Graph:** Run the (future) automation script to append the new project node to `knowledge-base/knowledge-graph.json`.

## Modifying Existing Services
1. If a service offering changes (e.g., renaming "Full-Stack" to "SaaS Architecture"):
   - Update `knowledge-base/services/saas-architecture.md`.
   - Perform a global search and replace in all `related_services` YAML arrays across the `projects/` directory to repair the graph edges.
   - Update `knowledge-foundation/aliases.json` to map queries for "Full-Stack" to the new "SaaS Architecture" entity.
