import { IndexRequest, IndexResult, IndexedChunk } from './types';
import { IndexingValidator } from './validator';
import { RecordBuilder } from './record';
import { providerFactory } from '../providers';
import { IndexExecutionError } from './errors';

export class IndexingPipeline {
  private validator: IndexingValidator;
  private recordBuilder: RecordBuilder;

  constructor() {
    this.validator = new IndexingValidator();
    this.recordBuilder = new RecordBuilder();
  }

  public async process(request: IndexRequest): Promise<IndexResult> {
    const startTime = Date.now();

    // 1. Validate incoming ingestion result
    this.validator.validateRequest(request);

    // 2. Resolve provider strictly via factory (deterministic abstraction)
    const embeddingProvider = providerFactory.getEmbeddingProvider();
    if (!embeddingProvider) {
      throw new IndexExecutionError('Failed to resolve EmbeddingProvider from factory.');
    }

    const { documentId, chunks } = request.ingestionResult;
    const indexedChunks: IndexedChunk[] = [];

    // 3. Embed and 4. Construct records sequentially to preserve deterministic ordering
    // (Interface only supports single string embed, so we loop)
    for (const chunk of chunks) {
      try {
        const embedding = await embeddingProvider.embed(chunk.content);
        const indexedChunk = this.recordBuilder.buildRecord(chunk, embedding);
        indexedChunks.push(indexedChunk);
      } catch (err: any) {
        throw new IndexExecutionError(`Embedding failed for chunk ${chunk.id}: ${err.message}`);
      }
    }

    // 5. Post-embedding validation
    this.validator.validateIndexedChunks(indexedChunks);

    const embeddingDurationMs = Date.now() - startTime;

    // 6. Return immutable result
    return {
      document: {
        documentId,
        chunks: indexedChunks
      },
      statistics: {
        chunkCount: indexedChunks.length,
        embeddingDurationMs
      }
    };
  }
}

export const indexingPipeline = new IndexingPipeline();
