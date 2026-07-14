export class UnsupportedDocumentTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedDocumentTypeError';
  }
}

export class InvalidDocumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDocumentError';
  }
}

export class DuplicateChunkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateChunkError';
  }
}

export class InvalidChunkMetadataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidChunkMetadataError';
  }
}
