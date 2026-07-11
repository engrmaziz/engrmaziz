# MCP Tool Catalog

The following tools should be implemented in the future MCP Server to allow Claude to query the graph dynamically.

## 1. `search_projects`
- **Description:** Search for projects by technology or industry.
- **Arguments:**
  - `technology` (string, optional): E.g., "FastAPI".
  - `industry` (string, optional): E.g., "Healthcare".
- **Returns:** An array of `project.json` compliant objects.

## 2. `get_candidate_summary`
- **Description:** Retrieves the up-to-date candidate summary for ATS or Recruiter parsing.
- **Arguments:** None.
- **Returns:** Text content from `recruiter/candidate-summary.md`.

## 3. `get_metrics`
- **Description:** Retrieves quantitative ROI metrics for a specific project.
- **Arguments:**
  - `project_id` (string, required): E.g., "proj_novasole_001".
- **Returns:** A string detailing costs, latency, and scale (e.g., "500k monthly visitors, 10M PKR sales").
