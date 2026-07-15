import { ragDatabase, ChunkRecord, EmbeddingRecord } from '../rag/supabase';
import { IndexedChunk } from '../indexing/types';
import { StorageExecutionError } from './errors';
import { systemConfig } from '../system';

export class VectorRepository {
  /**
   * Persists indexed chunks purely using the existing ragDatabase abstraction.
   * Maintains exact chunk ordering.
   */
  public async upsert(documentId: string, indexedChunks: IndexedChunk[]): Promise<void> {
    try {
      const chunkRecords: ChunkRecord[] = [];
      const embeddingRecords: Omit<EmbeddingRecord, 'chunk_id'>[] = [];
      
      const embeddingModel = systemConfig.EMBEDDING_PROVIDER;

      for (let i = 0; i < indexedChunks.length; i++) {
        const chunk = indexedChunks[i];
        
        chunkRecords.push({
          parent_document: documentId,
          chunk_text: chunk.text,
          chunk_number: chunk.metadata.chunkIndex,
          chunk_hash: chunk.chunkId,
          metadata: chunk.metadata,
          token_count: 0 // Kept minimal as per constraints
        });

        embeddingRecords.push({
          embedding_model: embeddingModel,
          document_id: documentId,
          vector: chunk.embedding,
          version: '1.0.0',
          chunk_hash: chunk.chunkId
        });
      }

      // Delegate persistence to the existing repository abstraction
      await ragDatabase.insertChunksAndEmbeddings(chunkRecords, embeddingRecords);
    } catch (err: any) {
      throw new StorageExecutionError(`Failed to upsert chunks for document ${documentId}: ${err.message}`);
    }
  }

  /**
   * Deletes a document using the existing ragDatabase abstraction.
   */
  public async deleteDocument(documentId: string): Promise<void> {
    try {
      await ragDatabase.deleteDocument(documentId);
    } catch (err: any) {
      throw new StorageExecutionError(`Failed to delete document from vector database: ${err.message}`);
    }
  }

  /**
   * Fetches document metadata strictly without retrieval logic.
   */
  public async getDocumentMetadata(documentId: string): Promise<any | null> {
    try {
      return await ragDatabase.getDocumentById(documentId);
    } catch (err: any) {
      throw new StorageExecutionError(`Failed to fetch document metadata: ${err.message}`);
    }
  }
}
