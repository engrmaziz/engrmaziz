import { DocumentSource, IngestionDocument } from './types';
import { UnsupportedDocumentTypeError } from './errors';

export class DocumentParser {
  public parse(source: DocumentSource): IngestionDocument {
    if (!this.isSupported(source.filename)) {
      throw new UnsupportedDocumentTypeError(`Unsupported file type: ${source.filename}. Only .md and .txt are supported.`);
    }

    let cleanedContent = source.rawContent;

    // Very rudimentary markdown normalization to keep it deterministic and simple.
    if (source.filename.toLowerCase().endsWith('.md')) {
      // Remove ATX headers, bold/italic, etc., while retaining the text.
      // E.g., remove leading hashes
      cleanedContent = cleanedContent.replace(/^#{1,6}\s+/gm, '');
      // Remove bold/italics wrappers
      cleanedContent = cleanedContent.replace(/(\*\*|__)(.*?)\1/g, '$2');
      cleanedContent = cleanedContent.replace(/(\*|_)(.*?)\1/g, '$2');
    }

    return {
      id: source.id,
      source: source.filename,
      title: source.filename.split('/').pop() || source.filename,
      content: cleanedContent.trim()
    };
  }

  private isSupported(filename: string): boolean {
    const lower = filename.toLowerCase();
    return lower.endsWith('.md') || lower.endsWith('.txt');
  }
}
