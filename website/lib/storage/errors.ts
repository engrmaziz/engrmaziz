export class StorageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageValidationError';
  }
}

export class StorageExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageExecutionError';
  }
}

export class DuplicateRecordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateRecordError';
  }
}
