import { KnowledgeRequest } from './types';
import { KnowledgeValidationError } from './errors';

export class KnowledgeValidator {
  public validate(request: KnowledgeRequest): void {
    if (!request || !request.document) {
      throw new KnowledgeValidationError('KnowledgeRequest must contain a valid document.');
    }

    const doc = request.document;

    if (!doc.id || typeof doc.id !== 'string') {
      throw new KnowledgeValidationError('KnowledgeDocument must have a valid string identifier (id).');
    }

    if (!doc.type || typeof doc.type !== 'string') {
      throw new KnowledgeValidationError('KnowledgeDocument must specify a supported type.');
    }

    if (!doc.content || typeof doc.content !== 'string' || doc.content.trim() === '') {
      throw new KnowledgeValidationError('KnowledgeDocument content cannot be empty.');
    }

    // Enterprise synchronous ingestion limit (e.g. 1MB roughly 1 million chars)
    if (doc.content.length > 1000000) {
      throw new KnowledgeValidationError('KnowledgeDocument exceeds the maximum synchronous ingestion size limit (1,000,000 characters).');
    }
  }
}
