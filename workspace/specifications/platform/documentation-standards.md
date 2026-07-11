# Documentation Standards

To ensure long-term machine readability, every Markdown file must adhere to these structural constraints.

## 1. File Naming
- All files must be lowercase.
- Spaces must be replaced with hyphens (`-`).
- Example: `self-healing-rag.md` (Not `Self Healing RAG.md`).

## 2. YAML Front Matter
- Every file MUST begin with a YAML block enclosed by `---`.
- Lists/Arrays must use JSON-style syntax: `tags: [ai, python, nextjs]`.
- Booleans must be lowercase: `is_active: true`.

## 3. Headings & Chunking Boundaries
- The H1 (`#`) is reserved exclusively for the document title at the very top.
- Major logical sections must use H2 (`##`). This signals to semantic splitters that a new topical chunk is beginning.
- Do not skip heading levels (e.g., jumping from H2 to H4).

## 4. Internal Linking
- When referencing another entity within the body text, use standard markdown linking with relative paths.
- Example: `Built using [FastAPI](../../skills/fastapi.md)`.
- This ensures web crawlers (Googlebot) and RAG agents can physically traverse the graph without relying solely on YAML.
