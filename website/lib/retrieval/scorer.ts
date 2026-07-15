import { RetrievalCandidate } from './types';

export class RetrievalScorer {
  /**
   * Normalizes raw database candidates, mapping the similarity bounds 
   * into a deterministic 0-1 range if necessary, and guarantees stable ordering.
   */
  public score(rawCandidates: any[]): RetrievalCandidate[] {
    const candidates = rawCandidates.map(raw => {
      // Postgres similarity could be negative in some bounds depending on metric,
      // clamp the lower bound to 0 for stability.
      const rawSimilarity = typeof raw.similarity === 'number' ? raw.similarity : 
                            (typeof raw.score === 'number' ? raw.score : 0.0);
      const normalizedScore = Math.max(0.0, Math.min(1.0, rawSimilarity));

      return {
        chunk_id: raw.chunk_id || raw.id,
        document_id: raw.document_id || raw.parent_document,
        chunk_text: raw.chunk_text,
        chunk_number: raw.chunk_number,
        metadata: raw.metadata || {},
        similarity: normalizedScore
      } as RetrievalCandidate;
    });

    // Deterministic sorting: Descending by similarity, ascending by chunk_id on tie
    return candidates.sort((a, b) => {
      if (Math.abs(a.similarity - b.similarity) > Number.EPSILON) {
        return b.similarity - a.similarity;
      }
      return a.chunk_id.localeCompare(b.chunk_id);
    });
  }
}
