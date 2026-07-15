import { EvaluationSuite } from './types';
import { EvaluationValidationError } from './errors';

export class EvaluationValidator {
  public validate(suite: EvaluationSuite): void {
    if (!suite.id || !suite.name || !Array.isArray(suite.cases)) {
      throw new EvaluationValidationError('Suite must contain id, name, and an array of cases.');
    }

    const ids = new Set<string>();

    for (const testCase of suite.cases) {
      if (!testCase.id || !testCase.category || !testCase.input) {
        throw new EvaluationValidationError(`Test case missing required fields (id, category, input). Offending test case: ${JSON.stringify(testCase)}`);
      }

      if (ids.has(testCase.id)) {
        throw new EvaluationValidationError(`Duplicate test case id found: ${testCase.id}`);
      }
      ids.add(testCase.id);

      if (!Array.isArray(testCase.expectedFacts)) {
        throw new EvaluationValidationError(`Test case ${testCase.id} missing expectedFacts array.`);
      }
      if (!Array.isArray(testCase.expectedTools)) {
        throw new EvaluationValidationError(`Test case ${testCase.id} missing expectedTools array.`);
      }
      if (!Array.isArray(testCase.expectedDocuments)) {
        throw new EvaluationValidationError(`Test case ${testCase.id} missing expectedDocuments array.`);
      }
    }
  }
}
