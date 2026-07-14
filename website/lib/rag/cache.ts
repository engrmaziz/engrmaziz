/* eslint-disable @typescript-eslint/no-explicit-any */
import { ragDatabase } from './supabase';
import { createLogger } from './logger';
import * as crypto from 'crypto';

const log = createLogger('SemanticCache');

export interface CacheEntry {
  responseText: string;
  metadata: Record<string, any>;
  similarity?: number;
  timestamp: number;
}

export class RAGSemanticCache {
  private localCache: Map<string, CacheEntry> = new Map();
  private maxLocalItems = 1000;
  private defaultTTLMs = 24 * 60 * 60 * 1000; // 24 hours

  private getHash(text: string): string {
    return crypto.createHash('sha256').update(text.toLowerCase().trim()).digest('hex');
  }

  /**
   * Search for a cached response using both exact lexical hash and semantic vector matching.
   */
  async get(queryText: string, queryEmbedding: number[], similarityThreshold: number = 0.98): Promise<CacheEntry | null> {
    const hash = this.getHash(queryText);
    
    // 1. Check Local Memory (Fastest, exact match)
    const localHit = this.localCache.get(hash);
    if (localHit) {
      if (Date.now() - localHit.timestamp > this.defaultTTLMs) {
        this.localCache.delete(hash);
      } else {
        log.debug('Local memory cache hit.', { hash });
        return localHit;
      }
    }

    // 2. Check Database Exact Match (Fast)
    try {
      const dbExact = await ragDatabase.getCachedResponse(hash);
      if (dbExact) {
        log.debug('Database exact cache hit.', { hash });
        const entry = {
          responseText: dbExact.response_text,
          metadata: dbExact.metadata,
          timestamp: Date.now()
        };
        this.setLocal(hash, entry);
        return entry;
      }
    } catch (error) {
      log.warn('Database exact cache lookup failed', error);
    }

    // 3. Check Database Semantic Match (Vector Similarity)
    try {
      const semanticHit = await ragDatabase.lookupSemanticCache(queryEmbedding, similarityThreshold);
      if (semanticHit) {
        log.debug('Database semantic cache hit.', { similarity: semanticHit.similarity });
        const entry = {
          responseText: semanticHit.response_text,
          metadata: semanticHit.metadata,
          similarity: semanticHit.similarity,
          timestamp: Date.now()
        };
        // Do not cache semantic hits as exact hits in local memory to avoid drift,
        // unless they are extremely close.
        if (semanticHit.similarity > 0.99) {
          this.setLocal(hash, entry);
        }
        return entry;
      }
    } catch (error) {
      log.warn('Database semantic cache lookup failed', error);
    }

    return null;
  }

  /**
   * Save a response to both local memory and the database cache table.
   */
  async set(queryText: string, queryEmbedding: number[], responseText: string, metadata: Record<string, any> = {}): Promise<void> {
    const hash = this.getHash(queryText);
    const entry: CacheEntry = { responseText, metadata, timestamp: Date.now() };
    
    // Set Local
    this.setLocal(hash, entry);

    // Set DB
    try {
      await ragDatabase.setCachedResponse(hash, queryText, queryEmbedding, responseText, metadata);
      log.debug('Saved response to database cache.', { hash });
    } catch (error) {
      log.error('Failed to write to database cache.', error);
    }
  }

  private setLocal(hash: string, entry: CacheEntry) {
    if (this.localCache.size >= this.maxLocalItems) {
      // Simple FIFO eviction
      const firstKey = this.localCache.keys().next().value;
      if (firstKey) this.localCache.delete(firstKey);
    }
    this.localCache.set(hash, entry);
  }

  /**
   * Clears the local memory cache. (Redis integration point for distributed environments)
   */
  clearLocal() {
    this.localCache.clear();
    log.info('Local memory cache cleared.');
  }
}

export const ragCache = new RAGSemanticCache();
