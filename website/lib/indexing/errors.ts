export class IndexValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IndexValidationError';
  }
}

export class IndexExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IndexExecutionError';
  }
}

export class DuplicateIndexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateIndexError';
  }
}
