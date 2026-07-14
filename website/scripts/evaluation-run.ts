import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { evaluationDataset, EvaluationRunner, generateReport } from '../lib/evaluation';
import { validateStartup } from '../lib/system';

async function executeEvaluation() {
  validateStartup();
  console.log('==========================================');
  console.log('ENTERPRISE EVALUATION & REGRESSION SUITE');
  console.log('==========================================');

  const runner = new EvaluationRunner();
  const report = await runner.runDataset(evaluationDataset);

  generateReport(report);

  console.log('\n==========================================');
  console.log(`EVALUATION COMPLETE`);
  console.log(`Total:  ${report.totalTests}`);
  console.log(`Passed: ${report.passed}`);
  console.log(`Failed: ${report.failed}`);
  console.log(`Avg Latency: ${Math.round(report.averageLatency)}ms`);
  console.log('==========================================');

  if (report.failed > 0) {
    console.error('\n[!] CRITICAL: Regression tests failed. Pipeline behavior has changed.');
    process.exit(1);
  } else {
    console.log('\n[✓] All tests passed. No regressions detected.');
    process.exit(0);
  }
}

executeEvaluation();
