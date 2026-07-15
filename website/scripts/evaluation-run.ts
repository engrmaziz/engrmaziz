import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import * as fs from 'fs';
import * as path from 'path';
import { EvaluationRunner, EvaluationSuite, EvaluationReport } from '../lib/evaluation';
import { validateStartup } from '../lib/system';

async function executeEvaluation() {
  validateStartup();
  console.log('==========================================');
  console.log('ENTERPRISE EVALUATION & REGRESSION SUITE');
  console.log('==========================================');

  const suitePath = path.join(process.cwd(), 'evaluation', 'sample-suite.json');
  const suiteData = JSON.parse(fs.readFileSync(suitePath, 'utf8')) as EvaluationSuite;

  const runner = new EvaluationRunner();
  const report: EvaluationReport = await runner.runSuite(suiteData);

  for (const res of report.results) {
    console.log(`[Runner] Executing test: ${res.id} (${res.category})`);
    console.log(`[Runner] Result: ${res.status} ${res.failureReason ? `(${res.failureReason})` : ''} - ${res.durationMs}ms\n`);
  }

  // Attempt to grab git commit
  let gitCommit = null;
  try {
    const { execSync } = require('child_process');
    gitCommit = execSync('git rev-parse HEAD').toString().trim();
  } catch {
    // ignore
  }

  const finalReport = {
    ...report,
    gitCommit
  };

  const reportPath = path.join(process.cwd(), 'regression-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2), 'utf8');
  console.log(`[Evaluation] Regression report generated at: ${reportPath}`);

  console.log('\n==========================================');
  console.log(`EVALUATION COMPLETE`);
  console.log(`Total:  ${report.statistics.totalTests}`);
  console.log(`Passed: ${report.statistics.passed}`);
  console.log(`Failed: ${report.statistics.failed}`);
  console.log(`Avg Latency: ${Math.round(report.statistics.averageLatency)}ms`);
  console.log('==========================================\n');

  if (report.statistics.failed > 0) {
    console.error('[!] CRITICAL: Regression tests failed. Pipeline behavior has changed.');
    process.exit(1);
  } else {
    console.log('[✓] All tests passed. No regressions detected.');
    process.exit(0);
  }
}

executeEvaluation();
