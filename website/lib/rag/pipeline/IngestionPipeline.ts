/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { embeddings } from '@/lib/rag/embeddings';
import { db } from '@/lib/db/supabase';
import { semanticChunker } from './SemanticChunker';
import { logger } from '@/lib/utils/logger';

export interface IngestionOptions {
  sourceType: 'markdown' | 'pdf' | 'docx' | 'sanity' | 'resume' | 'github';
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
  uploadedBy?: string;
}

export class IngestionPipeline {
  
  /**
   * Main entry point for the automated knowledge ingestion pipeline.
   * Extracts -> Cleans -> Metatags -> Chunks -> Embeds -> Stores.
   */
  async processDocument(title: string, rawContent: string, options: IngestionOptions) {
    logger.info(`Starting ingestion pipeline for: ${title}`);
    
    try {
      // 1. Text Extraction & Cleaning
      const cleanContent = this.cleanContent(rawContent, options.sourceType);
      
      // 2. Generate Metadata
      const metadata = this.generateMetadata(title, cleanContent, options);

      // 3. Create Document Record
      const docRecord = await db.insert('documents', {
        title,
        document_type: options.sourceType,
        version: metadata.version,
        checksum: metadata.checksum,
        embedding_status: 'processing',
        uploaded_by: options.uploadedBy
      });

      // 4. Semantic Chunking
      const chunks = semanticChunker.chunk(cleanContent, options.sourceType);

      // 5. Embedding Generation & Vector Storage (Batched)
      let processedChunks = 0;
      for (const chunk of chunks) {
        const vector = await embeddings.generateEmbedding(chunk.text);
        
        const chunkRecord = await db.insert('document_chunks', {
          parent_document: docRecord.id,
          chunk_text: chunk.text,
          chunk_number: chunk.sequence,
          metadata: { ...metadata, section: chunk.section, prev: chunk.prev, next: chunk.next }
        });

        await db.insert('embeddings', {
          embedding_model: 'jina-embeddings-v2-base-en',
          document_id: docRecord.id,
          chunk_id: chunkRecord.id,
          vector: vector,
          version: '1.0'
        });
        processedChunks++;
      }

      // 6. Update Document Status & Index Search
      await db.select('documents', { 
        id: docRecord.id, 
        embedding_status: 'completed', 
        indexed_status: true,
        chunk_count: processedChunks
      });

      logger.info(`Ingestion complete: ${title} (${processedChunks} chunks)`);
      return { success: true, documentId: docRecord.id, chunks: processedChunks };

    } catch (error) {
      logger.error(`Ingestion failed: ${title}`, { error });
      throw error;
    }
  }

  private cleanContent(content: string, _type: string) {
    // Strip unnecessary whitespace, normalize Unicode
    return content.normalize('NFKC').replace(/\r\n/g, '\n');
  }

  private generateMetadata(title: string, content: string, options: IngestionOptions) {
    // Basic SHA-256 stub for architecture
    const checksum = `chk_${Date.now()}`;
    return {
      title,
      source: options.sourceType,
      url: options.sourceUrl,
      version: `v_${Date.now()}`,
      checksum,
      extractedTags: this.extractTags(content),
      ...options.metadata
    };
  }

  private extractTags(content: string) {
    const techStack = ['Go', 'Python', 'React', 'Next.js', 'PostgreSQL', 'RAG', 'AI'];
    return techStack.filter(tech => content.includes(tech));
  }
}

export const ingestionPipeline = new IngestionPipeline();
