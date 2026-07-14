export interface DocumentSource {
  id: string; // The canonical ID for the document
  filename: string; // The original filename or source path
  rawContent: string; // The raw string content
  mimeType?: string; // Optional MIME type
}

export interface IngestionDocument {
  id: string;
  source: string;
  title: string;
  content: string; // Cleaned, parsed content
}

export interface ChunkMetadata {
  documentId: string;
  chunkId: string;
  source: string;
  title: string;
  chunkIndex: number;
}

export interface Chunk {
  id: string;
  content: string;
  metadata: ChunkMetadata;
}

export interface IngestionResult {
  documentId: string;
  chunks: Chunk[];
}
