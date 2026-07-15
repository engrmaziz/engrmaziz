export class KnowledgeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KnowledgeValidationError';
  }
}

export class KnowledgeExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KnowledgeExecutionError';
  }
}
