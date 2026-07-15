export class RetrievalValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetrievalValidationError';
  }
}

export class RetrievalExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetrievalExecutionError';
  }
}
