import { EvaluationReport } from './types';

export class EvaluationReporter {
  /**
   * Deterministically serializes the EvaluationReport to a JSON string.
   */
  public generateJson(report: EvaluationReport): string {
    return JSON.stringify(report, null, 2);
  }
}
