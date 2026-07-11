# API Resource Map

This maps physical files in the knowledge base to theoretical REST endpoints.

| Knowledge Base Path | REST Endpoint | Supported Methods |
|---------------------|---------------|-------------------|
| `knowledge-base/projects/` | `/api/v1/projects` | GET |
| `knowledge-base/experience/` | `/api/v1/experience` | GET |
| `knowledge-base/skills/` | `/api/v1/skills` | GET |
| `knowledge-base/services/` | `/api/v1/services` | GET |
| `assistant-intelligence/recruiter/` | `/api/v1/intelligence/reports` | GET, POST (Generate) |

## Read-Only by Default
The platform is designed to be **Read-Only** for external consumers (GET). Modifications to the knowledge base (POST/PUT/DELETE) must occur via Git commits and CI/CD pipelines to ensure schema validation and graph rebuilding.
