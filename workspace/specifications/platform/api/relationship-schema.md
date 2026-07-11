# Relationship Schema (Graph API)

When querying entities, relationships can be explicitly expanded.

## Edge Definitions
- `USES`: Connects Project -> Technology
- `WORKED_AT`: Connects Person -> Experience
- `HAS_SKILL`: Connects Person -> Skill
- `REQUIRES`: Connects Service -> Skill

## Hydration Strategy
If an API client requests a project:
`GET /api/v1/projects/aegisflow`

The response should return the raw entity, with a `relationships` object containing URIs to the connected entities, preventing massive payload bloat.

```json
"relationships": {
  "technologies": [
    "/api/v1/technologies/nextjs",
    "/api/v1/technologies/fastapi"
  ]
}
```
Clients must explicitly pass an `?expand=technologies` query parameter if they want the related data hydrated in a single request.
