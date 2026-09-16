/* eslint-disable @typescript-eslint/no-explicit-any */
import { ragDatabase } from './supabase';
import { ragContextBuilder } from './context-builder';
import { telemetryLogger } from '../telemetry';
import { systemConfig } from '../system/config';
import { localKnowledgeIndex } from './local-index';

export interface RetrievedChunk {
  chunkId: string;
  documentId: string;
  chunkText: string;
  chunkNumber: number;
  metadata: Record<string, any>;
  score: number;
}

const STOP = new Set(['the','and','for','with','that','this','from','your','about','what','how','does','have','been','into','their','you','are','was','can','could','would','please','explain','tell','more']);
const INDEX_TITLES = /master knowledge|rag index|glossary|navigation/i;
const JSONLD_RE = /"@context"\s*:\s*"https:\/\/schema\.org"/i;

type RawHit = {
  chunk_id: string;
  document_id: string;
  chunk_text: string;
  chunk_number: number;
  metadata?: Record<string, any>;
  similarity?: number;
  semantic_score?: number;
  score?: number;
  combined_score?: number;
};

export class RAGRetriever {
  async retrieve(
    query: string,
    limit: number = 4,
    threshold: number = 0.22,
    filters: Record<string, any> = {},
    queryVector?: number[]
  ): Promise<{ contextText: string; chunks: RetrievedChunk[]; citations: any[]; cragEval: string; stageTimings?: Record<string, number> }> {
    const stageTimings: Record<string, number> = {};
    const started = performance.now();

    try {
      const localStart = performance.now();
      const localHits = localKnowledgeIndex.search(query, Math.max(limit, 4));
      stageTimings['LocalSearch'] = performance.now() - localStart;

      if (localHits.length > 0) {
        const { contextText, citations } = ragContextBuilder.buildContext(
          localHits as any,
          Math.min(systemConfig.RAG_MAX_CONTEXT_TOKENS || 1600, 1600)
        );
        stageTimings['Total'] = performance.now() - started;
        telemetryLogger.log('RAG', `Local retrieval returned ${localHits.length} chunks`);
        return {
          contextText,
          chunks: localHits,
          citations,
          cragEval: 'RELEVANT',
          stageTimings
        };
      }

      const terms = this.toSearchTerms(query);
      const ftsStart = performance.now();
      const ftsRows = terms.length
        ? await ragDatabase.keywordSearch(terms, 8).catch(() => [])
        : [];

      let vecRows: RawHit[] = [];
      if (queryVector?.length) {
        vecRows = await ragDatabase.matchEmbeddings(queryVector, threshold, 8, filters).catch(() => []) as RawHit[];
      }
      stageTimings['HybridSearch'] = performance.now() - ftsStart;

      const fused = this.fuse(query, vecRows as RawHit[], ftsRows as RawHit[], Math.max(limit, 4));
      if (fused.length === 0) {
        return { contextText: '', chunks: [], citations: [], cragEval: 'IRRELEVANT', stageTimings };
      }

      const { contextText, citations } = ragContextBuilder.buildContext(
        fused as any,
        Math.min(systemConfig.RAG_MAX_CONTEXT_TOKENS || 1600, 1600)
      );

      stageTimings['Total'] = performance.now() - started;
      telemetryLogger.log('RAG', `Hybrid retrieval returned ${fused.length} chunks`);

      return {
        contextText,
        chunks: fused,
        citations,
        cragEval: 'RELEVANT',
        stageTimings
      };
    } catch (err: any) {
      telemetryLogger.error('RAG', 'Retrieval operation failed', err);
      return { contextText: '', chunks: [], citations: [], cragEval: 'ERROR', stageTimings };
    }
  }

  private toSearchTerms(query: string): string[] {
    const extras: string[] = [];
    const q = query.toLowerCase();
    if (/\brag\b/.test(q) && !/ragx/.test(q)) extras.push('retrieval');
    if (/\bchatbot/.test(q)) extras.push('chatbot');
    if (/\bvoice|call agent|telephony/.test(q)) extras.push('voicerag');
    if (/\baegis/.test(q)) extras.push('aegisflow');
    if (/\bdentl/.test(q)) extras.push('dentl2');

    const terms = `${query} ${extras.join(' ')}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 3 && !STOP.has(t));

    return Array.from(new Set(terms)).slice(0, 6);
  }

  private fuse(query: string, dense: RawHit[], sparse: RawHit[], limit: number): RetrievedChunk[] {
    const q = query.toLowerCase();
    const ranks = new Map<string, { hit: RawHit; denseRank: number; sparseRank: number }>();

    dense.forEach((hit, idx) => {
      if (!hit?.chunk_id || this.isJunk(hit)) return;
      ranks.set(hit.chunk_id, { hit, denseRank: idx + 1, sparseRank: 999 });
    });
    sparse.forEach((hit, idx) => {
      if (!hit?.chunk_id || this.isJunk(hit)) return;
      const existing = ranks.get(hit.chunk_id);
      if (existing) {
        existing.sparseRank = idx + 1;
      } else {
        ranks.set(hit.chunk_id, { hit, denseRank: 999, sparseRank: idx + 1 });
      }
    });

    const queryTerms = q.replace(/[^\w\s-]/g, ' ').split(/\s+/).filter((t) => t.length > 2);
    const wantsServices = /service|offer|hire|build|need/.test(q);
    const wantsProjects = /project|built|portfolio|aegis|voicerag|dentl|auranode/.test(q);

    const scored = Array.from(ranks.values()).map(({ hit, denseRank, sparseRank }) => {
      const text = (hit.chunk_text || '').toLowerCase();
      const meta = hit.metadata || {};
      const title = String(meta.title || '');
      const url = String(meta.url || meta.source || '');
      const category = String(meta.category || '').toLowerCase();

      let score = 1 / (60 + denseRank) + 1 / (60 + sparseRank);
      const denseSim = Number(hit.similarity || hit.semantic_score || 0);
      if (denseSim > 0) score += denseSim * 0.35;

      let lexical = 0;
      for (const term of queryTerms) {
        if (text.includes(term) || title.toLowerCase().includes(term)) lexical += term.length > 5 ? 1.4 : 1;
      }
      if (queryTerms.length) score += (lexical / queryTerms.length) * 0.25;

      if (wantsServices && (url.includes('/services/') || category === 'service')) score += 0.18;
      if (wantsProjects && (url.includes('/projects/') || category === 'project')) score += 0.18;
      if (INDEX_TITLES.test(title) || category === 'index') score -= 0.35;
      if (/faq|frequently asked/i.test(title) && !/faq/.test(q)) score -= 0.4;
      if (queryTerms.some((term) => title.toLowerCase().includes(term))) score += 0.45;
      if (JSONLD_RE.test(hit.chunk_text || '')) score -= 0.35;

      return {
        chunkId: hit.chunk_id,
        documentId: hit.document_id,
        chunkText: hit.chunk_text,
        chunkNumber: hit.chunk_number,
        metadata: meta,
        score
      } as RetrievedChunk;
    });

    scored.sort((a, b) => b.score - a.score);

    const seenDocs = new Map<string, number>();
    const diverse: RetrievedChunk[] = [];
    for (const chunk of scored) {
      const count = seenDocs.get(chunk.documentId) || 0;
      if (count >= 2) continue;
      seenDocs.set(chunk.documentId, count + 1);
      diverse.push(chunk);
      if (diverse.length >= limit) break;
    }

    return diverse;
  }

  private isJunk(hit: RawHit): boolean {
    const text = hit.chunk_text || '';
    if (text.trim().length < 60) return true;
    if (JSONLD_RE.test(text) && text.length < 280) return true;
    return false;
  }
}

export const ragRetriever = new RAGRetriever();
