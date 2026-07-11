# Metadata Filtering Strategy

To prevent semantic dilution, the search system must heavily rely on the structured YAML front matter.

## Pre-Filtering Logic
Before executing a Vector Search, the system should apply exact-match filters based on the YAML schemas defined in `platform/schemas/`.

### Example Use Cases
- **Query:** "Show me Python projects."
- **Bad RAG:** Vector search for "Python". Might return a blog post *talking* about Python.
- **Good RAG:** Apply filter `category == "Project"`. Then execute Vector search within that subset.

## Required Metadata Fields for Indexing
When ingesting markdown files into the Vector DB (e.g., Qdrant, Pinecone), the payload must map the YAML directly to DB metadata fields:
- `id`
- `category`
- `tags`
- `is_nda` (Critical for access control filtering)
