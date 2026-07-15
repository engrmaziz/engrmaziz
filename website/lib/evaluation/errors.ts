export class EvaluationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EvaluationValidationError';
  }
}

export class EvaluationExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EvaluationExecutionError';
  }
}
