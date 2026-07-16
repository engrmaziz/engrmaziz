// @ts-nocheck
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import * as fs from 'fs';
import * as path from 'path';
import { EvaluationRunner, EvaluationReporter, EvaluationSuite } from '../lib/evaluation';
import { validateStartup } from '../lib/system';
import { logger } from '../lib/utils/logger';

async function runBenchmark() {
  validateStartup();
  
  const suitePath = path.join(process.cwd(), 'evaluation', 'sample-suite.json');
  const suiteData = JSON.parse(fs.readFileSync(suitePath, 'utf8')) as EvaluationSuite;

  logger.info(`Starting Benchmark: ${suiteData.name}`);

  const runner = new EvaluationRunner();
  const report = await runner.runSuite(suiteData);

  // Attempt to add git commit
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

  const reporter = new EvaluationReporter();
  const jsonOutput = reporter.generateJson(finalReport);

  const reportPath = path.join(process.cwd(), 'benchmark-report.json');
  fs.writeFileSync(reportPath, jsonOutput, 'utf8');

  logger.info(`Benchmark completed. Deterministic JSON report written to: ${reportPath}`);
}

runBenchmark().catch(err => {
  logger.error('Benchmark failed', err);
  process.exit(1);
});
