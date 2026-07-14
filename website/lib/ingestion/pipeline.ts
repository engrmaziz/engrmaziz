import { DocumentSource, IngestionResult } from './types';
import { DocumentParser } from './parser';
import { DocumentChunker } from './chunker';
import { IngestionValidator } from './validator';

export class IngestionPipeline {
  private parser: DocumentParser;
  private chunker: DocumentChunker;
  private validator: IngestionValidator;

  constructor() {
    this.parser = new DocumentParser();
    this.chunker = new DocumentChunker();
    this.validator = new IngestionValidator();
  }

  public process(source: DocumentSource): IngestionResult {
    // 1. Parse
    const document = this.parser.parse(source);
    
    // 2. Validate Document
    this.validator.validateDocument(document);
    
    // 3. Chunk & Generate Metadata
    const chunks = this.chunker.chunk(document);
    
    // 4. Validate Chunks
    this.validator.validateChunks(chunks);
    
    // 5. Return Result
    return {
      documentId: document.id,
      chunks: chunks
    };
  }
}

export const ingestionPipeline = new IngestionPipeline();
