# MCP Resource Map

MCP Resources act like a virtual filesystem exposed to the LLM. 

## URI Templates
The following URI templates should be registered in the MCP Server:

| Resource Name | URI Template | Description |
|---------------|--------------|-------------|
| `project` | `portfolio://projects/{project_id}` | Fetches a specific project markdown file. |
| `skill` | `portfolio://skills/{skill_name}` | Fetches a specific skill definition. |
| `experience` | `portfolio://experience/{company_id}` | Fetches a specific job history file. |
| `service` | `portfolio://services/{service_id}` | Fetches a service offering. |

## Example Usage
If Claude needs to read the AegisFlow project, it will issue a `resources/read` request with the URI: `portfolio://projects/aegisflow`. The server will map this directly to `C:/.../mak/knowledge-base/projects/aegisflow.md` and return the markdown text.
