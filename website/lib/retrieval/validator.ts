import { RetrievalRequest } from './types';
import { RetrievalValidationError } from './errors';

export class RetrievalValidator {
  public validate(request: RetrievalRequest): void {
    if (!request.queryEmbedding || !Array.isArray(request.queryEmbedding) || request.queryEmbedding.length === 0) {
      throw new RetrievalValidationError('RetrievalRequest must contain a valid queryEmbedding array.');
    }

    if (request.limit !== undefined && request.limit <= 0) {
      throw new RetrievalValidationError('RetrievalRequest limit must be a positive integer.');
    }

    if (request.threshold !== undefined && (request.threshold < -1 || request.threshold > 1)) {
      throw new RetrievalValidationError('RetrievalRequest threshold must be between -1 and 1.');
    }

    const strategy = request.strategy || 'vector_only';
    if (strategy !== 'vector_only') {
      throw new RetrievalValidationError(`Unsupported retrieval strategy: ${strategy}`);
    }

    if (request.filters) {
      if (typeof request.filters !== 'object' || Array.isArray(request.filters)) {
        throw new RetrievalValidationError('RetrievalRequest filters must be a simple object of equality checks.');
      }
      
      // Prevent complex operators or nested objects
      for (const [key, value] of Object.entries(request.filters)) {
        if (typeof value === 'object' && value !== null) {
          throw new RetrievalValidationError(`Nested or complex filters are not supported for key: ${key}`);
        }
      }
    }
  }
}
