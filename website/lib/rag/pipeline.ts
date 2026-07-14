/* eslint-disable @typescript-eslint/no-explicit-any */
import { ragParser } from './parser';
import { ragChunker } from './chunker';
import { ragEmbedder } from './embedder';
import { ragDatabase } from './supabase';
import { createLogger } from './logger';
import { systemConfig } from '../system';
import * as crypto from 'crypto';

const log = createLogger('Pipeline');

export interface IngestOptions {
  filename: string;
  project?: string;
  version?: string;
  source?: string;
  uploadedBy?: string;
  customMetadata?: Record<string, any>;
}

export class RAGPipeline {
  /**
   * Run the complete document indexing flow.
   * Parses, cleans, chunks, embeds, and uploads to Supabase incrementally.
   */
  async ingestDocument(rawContent: string, options: IngestOptions) {
    const filename = options.filename;
    log.info(`Starting ingestion for: ${filename}`);

    // 1. Parsing & Content Extraction
    const parsed = ragParser.parse(rawContent, filename, parsedDocType(filename));
    
    // Merge parsing metadata with custom options
    const documentMetadata: Record<string, any> = {
      ...parsed.metadata,
      project: options.project || 'General',
      version: options.version || parsed.metadata.version || '1.0.0',
      source: options.source || filename,
      ...options.customMetadata
    };

    // Calculate file size
    const fileSize = Buffer.byteLength(rawContent, 'utf8');

    // 2. Incremental Indexing Check at Document Level
    let docRecord = await ragDatabase.getDocumentBySource(documentMetadata.source);

    if (docRecord) {
      if (docRecord.checksum === parsed.checksum && docRecord.indexed_status) {
        log.info(`Document "${parsed.title}" is already indexed. Skipping.`);
        return { success: true, skipped: true, documentId: docRecord.id };
      }
      log.info(`Document "${parsed.title}" has changed. Performing chunk-level incremental update.`);
      docRecord = await ragDatabase.updateDocument(docRecord.id!, {
        checksum: parsed.checksum,
        embedding_status: 'processing',
        file_size: fileSize,
        title: parsed.title,
        description: parsed.description
      });
    } else {
      // 3. Create Document Record (Pending State)
      docRecord = await ragDatabase.createDocument({
        title: parsed.title,
        description: parsed.description,
        document_type: parsed.documentType,
        project: documentMetadata.project,
        version: documentMetadata.version,
        source: documentMetadata.source,
        checksum: parsed.checksum,
        file_path: filename,
        file_size: fileSize,
        mime_type: parsed.documentType === 'markdown' ? 'text/markdown' : 'text/plain',
        embedding_status: 'processing',
        indexed_status: false
      });
    }

    try {
      // 4. Semantic Chunking
      const maxTokens = systemConfig.RAG_CHUNK_SIZE;
      const overlapTokens = systemConfig.RAG_CHUNK_OVERLAP;
      
      const chunks = ragChunker.chunk(parsed.content, parsed.documentType, maxTokens, overlapTokens);
      log.info(`Semantic split complete: ${chunks.length} chunks generated.`);

      if (chunks.length === 0) {
        throw new Error('No chunks generated. Check document content layout.');
      }

      // 5. Generate Chunk Hashes
      const newChunkHashes = chunks.map(c => {
        const hashStr = `${docRecord!.id}:${c.chunkNumber}:${c.text}`;
        return crypto.createHash('sha256').update(hashStr).digest('hex');
      });

      // 6. Chunk-level Incremental Comparison
      const existingChunksMap = await ragDatabase.getChunkHashesForDocument(docRecord!.id!);
      const existingHashes = Object.values(existingChunksMap);

      const chunksToInsert = [];
      const textsToEmbed = [];

      chunks.forEach((c, idx) => {
        const chunkHash = newChunkHashes[idx];
        if (!existingHashes.includes(chunkHash!)) {
          chunksToInsert.push({ chunk: c, chunkHash: chunkHash! });
          textsToEmbed.push(c.text);
        }
      });

      // Identify chunks that are in the DB but no longer in the new document
      const chunksToDeleteIds = Object.entries(existingChunksMap)
        .filter(([, hash]) => !newChunkHashes.includes(hash))
        .map(([id]) => id);

      log.info(`Incremental update: ${chunksToInsert.length} new chunks to insert, ${chunksToDeleteIds.length} stale chunks to delete.`);

      if (chunksToDeleteIds.length > 0) {
        await ragDatabase.deleteChunks(chunksToDeleteIds);
      }

      // 7. Embed and Insert New Chunks
      if (chunksToInsert.length > 0) {
        const vectors = await ragEmbedder.embedBatch(textsToEmbed);

        const dbChunksToInsert = chunksToInsert.map(({ chunk: c, chunkHash }) => ({
          parent_document: docRecord!.id!,
          chunk_text: c.text,
          chunk_number: c.chunkNumber,
          token_count: c.tokenCount,
          chunk_hash: chunkHash,
          metadata: {
            document_id: docRecord!.id!,
            title: documentMetadata.title,
            slug: documentMetadata.slug,
            url: documentMetadata.url,
            category: documentMetadata.category,
            pillar: documentMetadata.pillar,
            service: documentMetadata.service,
            project: documentMetadata.project,
            heading: c.metadata.heading || c.section || 'General',
            parent_heading: c.metadata.parent_heading || '',
            section: c.metadata.section || c.section || 'General',
            tags: documentMetadata.tags,
            keywords: documentMetadata.keywords,
            description: documentMetadata.description,
            updated_at: documentMetadata.updated_at,
            created_at: documentMetadata.created_at,
            reading_time: documentMetadata.reading_time,
            author: documentMetadata.author,
            checksum: documentMetadata.checksum,
            language: documentMetadata.language,
            source: documentMetadata.source,
            content: c.text,
            chunk_index: c.chunkNumber,
            total_chunks: chunks.length
          }
        }));

        const dbEmbeddingsToInsert = vectors.map((vector, idx) => ({
          embedding_model: systemConfig.JINA_EMBEDDING_MODEL,
          document_id: docRecord!.id!,
          vector,
          version: documentMetadata.version,
          embedding_version: 'v2', // RAG V2 schema addition
          chunk_hash: chunksToInsert[idx].chunkHash,
          document_hash: parsed.checksum
        }));

        await ragDatabase.insertChunksAndEmbeddings(dbChunksToInsert, dbEmbeddingsToInsert);
      }

      // 8. Update Document Status to Completed
      await ragDatabase.updateDocument(docRecord.id!, {
        embedding_status: 'completed',
        indexed_status: true,
        chunk_count: chunks.length
      });

      log.info(`Ingestion completed successfully for document: "${parsed.title}"`);
      return { success: true, skipped: chunksToInsert.length === 0, documentId: docRecord.id, chunksIndexed: chunksToInsert.length };

    } catch (err: any) {
      log.error(`Ingestion failed for document: "${parsed.title}".`, err);
      // Clean up the main document record if processing fails
      await ragDatabase.updateDocument(docRecord!.id!, {
        embedding_status: 'failed',
        indexed_status: false
      });
      throw err;
    }
  }
}

function parsedDocType(filename: string): 'markdown' | 'txt' {
  if (filename.endsWith('.md') || filename.endsWith('.mdx')) {
    return 'markdown';
  }
  return 'txt';
}

export const ragPipeline = new RAGPipeline();
