# API Entity Schema Definitions

This document outlines the conceptual mapping of the knowledge base entities into RESTful or GraphQL API resources.

## Base Uniformity
All API responses must wrap data in a standard envelope:
```json
{
  "data": { ... },
  "metadata": {
    "version": "1.0.0",
    "timestamp": 1715893200,
    "confidence": "High"
  },
  "links": {
    "self": "/api/v1/projects/aegisflow"
  }
}
```

## GraphQL Translation
The inherent graph nature of the knowledge base (`knowledge-graph.json`) maps perfectly to GraphQL. The schemas defined in `platform/schemas/` act as the exact TypeDefs for a future Apollo/Yoga server.

Example Query:
```graphql
query {
  project(id: "proj_aegisflow_001") {
    title
    github_url
    technologies {
      name
      category
    }
  }
}
```

## Pagination & Limits
All endpoints returning collections (e.g., `/api/v1/skills`) must enforce cursor-based pagination to support future scaling as the knowledge base grows to hundreds of entities.
