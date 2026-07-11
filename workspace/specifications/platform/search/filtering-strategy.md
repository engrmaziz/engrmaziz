# Filtering Strategy (Pre vs Post)

## 1. Pre-Filtering (Recommended)
Filtering the dataset *before* the vector search occurs. 
- **Mechanism:** Using Qdrant/Pinecone payload filters.
- **Example:** `must: [{ key: "category", match: { value: "Project" } }]`
- **Benefit:** Guarantees that the Top K results belong to the correct category. Prevents the search space from being polluted by irrelevant documents.

## 2. Post-Filtering (Discouraged)
Filtering the dataset *after* retrieving the Top K vector results.
- **Mechanism:** Retrieving Top 10 results, then throwing away 8 of them because they don't match the required `category`.
- **Drawback:** You are left with only 2 results to feed the LLM, severely starving the context window. 

## Rule
All RAG pipelines querying this knowledge base MUST utilize strict Pre-Filtering based on the YAML metadata schemas.
