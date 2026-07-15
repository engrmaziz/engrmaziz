/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from 'pg';
import { systemConfig } from '../system';

const url = systemConfig.NEXT_PUBLIC_SUPABASE_URL || '';
const projectRef = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1] || 'mrtfycddgwpvezbaxbdl';
const username = `postgres.${projectRef}`;
const password = systemConfig.SUPABASE_DB_PASSWORD || '';
const host = `aws-0-ap-northeast-1.pooler.supabase.com`;
const connectionString = `postgresql://${username}:${password}@${host}:5432/postgres`;

// Use service role key if available for backend ops
const key = systemConfig.SUPABASE_SERVICE_ROLE_KEY || 'dummy';
// Export a single connection pool for the server
export const pgPool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export interface DocumentRecord {
  id?: string;
  title: string;
  description?: string;
  document_type: 'markdown' | 'pdf' | 'txt' | 'csv' | 'json' | 'web';
  project?: string;
  version?: string;
  source?: string;
  checksum?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  chunk_count?: number;
  embedding_status: 'pending' | 'processing' | 'completed' | 'failed';
  indexed_status?: boolean;
  uploaded_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChunkRecord {
  id?: string;
  parent_document: string;
  chunk_text: string;
  chunk_number: number;
  metadata: Record<string, any>;
  token_count?: number;
  chunk_hash?: string;
  created_at?: string;
}

export interface EmbeddingRecord {
  id?: string;
  embedding_model: string;
  document_id: string;
  chunk_id: string;
  vector: number[];
  version?: string;
  embedding_version?: string;
  chunk_hash?: string;
  document_hash?: string;
  knowledge_version?: string;
  created_at?: string;
}

export class RAGDatabase {
  async getDocumentById(id: string): Promise<DocumentRecord | null> {
    const query = 'SELECT * FROM public.documents WHERE id = $1 LIMIT 1';
    const { rows } = await pgPool.query(query, [id]);
    return rows[0] || null;
  }

  async getDocumentByChecksum(checksum: string): Promise<DocumentRecord | null> {
    const query = 'SELECT * FROM public.documents WHERE checksum = $1 LIMIT 1';
    const { rows } = await pgPool.query(query, [checksum]);
    return rows[0] || null;
  }

  async getDocumentBySource(source: string): Promise<DocumentRecord | null> {
    const query = 'SELECT * FROM public.documents WHERE source = $1 LIMIT 1';
    const { rows } = await pgPool.query(query, [source]);
    return rows[0] || null;
  }

  async createDocument(doc: DocumentRecord): Promise<DocumentRecord> {
    const query = `
      INSERT INTO public.documents (
        title, description, document_type, project, version, 
        source, checksum, file_path, file_size, mime_type, 
        embedding_status, indexed_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const values = [
      doc.title, doc.description || '', doc.document_type, doc.project || 'General', doc.version || '1.0.0',
      doc.source || '', doc.checksum || '', doc.file_path || '', doc.file_size || 0, doc.mime_type || '',
      doc.embedding_status, doc.indexed_status || false
    ];
    
    const { rows } = await pgPool.query(query, values);
    return rows[0];
  }

  async updateDocument(id: string, updates: Partial<DocumentRecord>): Promise<DocumentRecord> {
    const keys = Object.keys(updates);
    if (keys.length === 0) {
      const { rows } = await pgPool.query('SELECT * FROM public.documents WHERE id = $1', [id]);
      return rows[0];
    }

    const setClauses = keys.map((key, index) => `"${key}" = $${index + 2}`);
    const query = `
      UPDATE public.documents 
      SET ${setClauses.join(', ')}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, ...keys.map(k => (updates as any)[k])];
    
    const { rows } = await pgPool.query(query, values);
    return rows[0];
  }

  async deleteDocument(id: string): Promise<void> {
    // Rely on CASCADE deletes defined in the schema to clean up chunks and embeddings
    const query = 'DELETE FROM public.documents WHERE id = $1';
    await pgPool.query(query, [id]);
  }

  async getChunkHashesForDocument(documentId: string): Promise<Record<string, string>> {
    const query = 'SELECT id, chunk_hash FROM public.document_chunks WHERE parent_document = $1 AND chunk_hash IS NOT NULL';
    const { rows } = await pgPool.query(query, [documentId]);
    const hashes: Record<string, string> = {};
    for (const row of rows) {
      hashes[row.id] = row.chunk_hash;
    }
    return hashes;
  }

  async deleteChunks(chunkIds: string[]): Promise<void> {
    if (chunkIds.length === 0) return;
    const placeholders = chunkIds.map((_, i) => `$${i + 1}`).join(',');
    const query = `DELETE FROM public.document_chunks WHERE id IN (${placeholders})`;
    await pgPool.query(query, chunkIds);
  }

  async insertChunksAndEmbeddings(
    chunks: ChunkRecord[],
    embeddings: Omit<EmbeddingRecord, 'chunk_id'>[]
  ): Promise<void> {
    const client = await pgPool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert chunks and capture returning IDs
      const insertedChunkIds: Record<number, string> = {};
      
      for (const chunk of chunks) {
        const chunkQuery = `
          INSERT INTO public.document_chunks (
            parent_document, chunk_text, chunk_number, token_count, metadata, chunk_hash
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `;
        const chunkValues = [
          chunk.parent_document, chunk.chunk_text, chunk.chunk_number, chunk.token_count || 0, JSON.stringify(chunk.metadata), chunk.chunk_hash || null
        ];
        
        const { rows } = await client.query(chunkQuery, chunkValues);
        insertedChunkIds[chunk.chunk_number] = rows[0].id;
      }

      // Insert matching embeddings
      for (let i = 0; i < embeddings.length; i++) {
        const emb = embeddings[i];
        const currentChunk = chunks[i];
        if (!emb || !currentChunk) continue;
        const chunkNumber = currentChunk.chunk_number;
        const chunkId = insertedChunkIds[chunkNumber];

        if (!chunkId) {
          throw new Error(`Failed to map chunk_number ${chunkNumber} to database chunk UUID`);
        }

        const embQuery = `
          INSERT INTO public.embeddings (
            embedding_model, document_id, chunk_id, vector, version, 
            embedding_version, chunk_hash, document_hash, knowledge_version
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        
        // Convert vector numbers array to PostgreSQL vector string format (e.g. '[0.1,0.2,...]')
        const vectorString = `[${emb.vector.join(',')}]`;
        const embValues = [
          emb.embedding_model, emb.document_id, chunkId, vectorString, emb.version || '1.0.0',
          emb.embedding_version || null, emb.chunk_hash || null, emb.document_hash || null, emb.knowledge_version || null
        ];

        await client.query(embQuery, embValues);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async matchEmbeddings(
    queryEmbedding: number[],
    threshold: number,
    limit: number,
    filterMetadata: Record<string, any> = {}
  ) {
    const vectorString = `[${queryEmbedding.join(',')}]`;
    const query = 'SELECT * FROM public.match_chunks($1, $2, $3, $4)';
    const { rows } = await pgPool.query(query, [vectorString, threshold, limit, JSON.stringify(filterMetadata)]);
    return rows;
  }

  async hybridSearch(
    queryEmbedding: number[],
    queryText: string,
    limit: number,
    threshold: number = 0.3,
    filterMetadata: Record<string, any> = {},
    semanticWeight: number = 0.7,
    lexicalWeight: number = 0.3
  ) {
    const vectorString = `[${queryEmbedding.join(',')}]`;
    const query = 'SELECT * FROM public.hybrid_search_chunks($1, $2, $3, $4, $5, $6, $7)';
    const { rows } = await pgPool.query(query, [vectorString, queryText, limit, threshold, JSON.stringify(filterMetadata), semanticWeight, lexicalWeight]);
    return rows;
  }

  async ftsSearch(
    queryText: string,
    limit: number,
    filterMetadata: Record<string, any> = {}
  ) {
    const query = `
      SELECT 
        dc.id as chunk_id,
        dc.parent_document as document_id,
        dc.chunk_text,
        dc.chunk_number,
        dc.metadata,
        ts_rank_cd(to_tsvector('english', dc.chunk_text), websearch_to_tsquery('english', $1)) as score
      FROM public.document_chunks dc
      WHERE to_tsvector('english', dc.chunk_text) @@ websearch_to_tsquery('english', $1)
        AND (
          $3 = '{}'::jsonb
          OR dc.metadata @> $3
        )
      ORDER BY score DESC
      LIMIT $2
    `;
    const { rows } = await pgPool.query(query, [queryText, limit, JSON.stringify(filterMetadata)]);
    return rows;
  }

  async lookupSemanticCache(queryEmbedding: number[], similarityThreshold: number = 0.96) {
    const vectorString = `[${queryEmbedding.join(',')}]`;
    const query = `
      SELECT response_text, metadata, 1 - (query_embedding <=> $1) as similarity
      FROM public.rag_cache
      WHERE 1 - (query_embedding <=> $1) > $2
      ORDER BY query_embedding <=> $1 ASC
      LIMIT 1
    `;
    const { rows } = await pgPool.query(query, [vectorString, similarityThreshold]);
    return rows[0] || null;
  }

  async writeCache(
    queryHash: string,
    queryText: string,
    queryEmbedding: number[],
    responseText: string,
    metadata: Record<string, any> = {}
  ) {
    const vectorString = `[${queryEmbedding.join(',')}]`;
    const query = `
      INSERT INTO public.rag_cache (
        query_hash, query_text, query_embedding, response_text, metadata
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (query_hash) DO NOTHING
    `;
    await pgPool.query(query, [queryHash, queryText, vectorString, responseText, JSON.stringify(metadata)]);
  }

  async getCachedResponse(queryHash: string) {
    const query = 'SELECT response_text, metadata FROM public.rag_cache WHERE query_hash = $1 LIMIT 1';
    const { rows } = await pgPool.query(query, [queryHash]);
    return rows[0] || null;
  }

  async setCachedResponse(
    queryHash: string,
    queryText: string,
    queryEmbedding: number[],
    responseText: string,
    metadata: Record<string, any> = {}
  ) {
    return this.writeCache(queryHash, queryText, queryEmbedding, responseText, metadata);
  }

  async logAnalytics(log: {
    sessionId?: string;
    queryText: string;
    queryEmbedding?: number[];
    responseText?: string;
    latencyMs: number;
    llmModel?: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    cost?: number;
    metadata?: Record<string, any>;
    feedback?: string;
    clickedCitation?: string;
  }) {
    const vectorString = log.queryEmbedding ? `[${log.queryEmbedding.join(',')}]` : null;
    const query = `
      INSERT INTO public.rag_logs (
        session_id, query_text, query_embedding, response_text, latency_ms,
        llm_model, prompt_tokens, completion_tokens, total_tokens, cost,
        metadata, feedback, clicked_citation
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `;
    await pgPool.query(query, [
      log.sessionId || null,
      log.queryText,
      vectorString,
      log.responseText || null,
      log.latencyMs,
      log.llmModel || null,
      log.promptTokens || 0,
      log.completionTokens || 0,
      log.totalTokens || 0,
      log.cost || 0,
      JSON.stringify(log.metadata || {}),
      log.feedback || null,
      log.clickedCitation || null
    ]);
  }

  async getDatabaseStatus() {
    const docQuery = 'SELECT COUNT(*) as count FROM public.documents';
    const chunkQuery = 'SELECT COUNT(*) as count FROM public.document_chunks';
    const latestQuery = 'SELECT updated_at FROM public.documents ORDER BY updated_at DESC LIMIT 1';

    const [docRes, chunkRes, latestRes] = await Promise.all([
      pgPool.query(docQuery),
      pgPool.query(chunkQuery),
      pgPool.query(latestQuery)
    ]);

    return {
      documents: parseInt(docRes.rows[0].count, 10) || 0,
      chunks: parseInt(chunkRes.rows[0].count, 10) || 0,
      latestSync: latestRes.rows[0]?.updated_at || null,
    };
  }

  async listDocuments(): Promise<DocumentRecord[]> {
    const query = 'SELECT * FROM public.documents ORDER BY title ASC';
    const { rows } = await pgPool.query(query);
    return rows;
  }

  // ==========================================
  // CONVERSATION MEMORY SERVICES
  // ==========================================

  async getConversation(id: string) {
    const { rows } = await pgPool.query('SELECT * FROM public.conversations WHERE id = $1 LIMIT 1', [id]);
    return rows[0] || null;
  }

  async createConversation(id?: string, visitorId: string = 'anonymous') {
    if (id) {
      const query = `INSERT INTO public.conversations (id, visitor_id) VALUES ($1, $2) RETURNING *`;
      const { rows } = await pgPool.query(query, [id, visitorId]);
      return rows[0];
    } else {
      const query = `INSERT INTO public.conversations (visitor_id) VALUES ($1) RETURNING *`;
      const { rows } = await pgPool.query(query, [visitorId]);
      return rows[0];
    }
  }

  async getRecentMessages(conversationId: string, limit: number = 10) {
    const { rows } = await pgPool.query(
      'SELECT * FROM public.messages WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT $2', 
      [conversationId, limit]
    );
    return rows;
  }

  async getUnsummarizedMessages(conversationId: string, offset: number) {
    const { rows } = await pgPool.query(
      'SELECT * FROM public.messages WHERE conversation_id = $1 ORDER BY created_at ASC OFFSET $2', 
      [conversationId, offset]
    );
    return rows;
  }

  async insertMessage(conversationId: string, role: string, content: string, citations: any = null, model: string | null = null, latency: number | null = null) {
    const query = `
      INSERT INTO public.messages (conversation_id, role, content, citations, model, latency)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await pgPool.query(query, [
      conversationId, 
      role, 
      content, 
      citations ? JSON.stringify(citations) : null, 
      model, 
      latency
    ]);
    return rows[0];
  }

  async updateConversationSummary(id: string, summary: string, messageCount: number) {
    const query = `UPDATE public.conversations SET summary = $2, summary_message_count = $3, summary_updated_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`;
    const { rows } = await pgPool.query(query, [id, summary, messageCount]);
    return rows[0];
  }
}

export const ragDatabase = new RAGDatabase();
