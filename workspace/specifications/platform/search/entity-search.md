# Graph Entity Search (Deterministic Retrieval)

Vector similarity is probabilistic. Graph traversal is deterministic.

## When to use Entity Search
When a user asks: "What technologies did Musharraf use at NovaSole?"
- A vector search might return chunks about "NovaSole" and chunks about "technologies" from other jobs.
- An Entity Search traverses `Company(NovaSole) -> WORKED_AT -> Experience -> USES -> Technology`. This guarantees 100% accuracy.

## The Cypher Blueprint
If `knowledge-graph.json` is imported into Neo4j or Memgraph, the retrieval for the above query becomes a simple Cypher transaction:
```cypher
MATCH (c:Company {id: 'NovaSole'})-[:WORKED_AT]-(e:Experience)-[:USES]->(t:Technology)
RETURN t.name
```
This output should be appended to the LLM context window alongside any semantic text chunks.
