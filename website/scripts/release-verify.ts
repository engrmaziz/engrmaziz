import { execSync } from 'child_process';
import { logger } from '../lib/utils/logger';

const scriptsToRun = [
  'npx tsx scripts/system-verify.ts',
  'npx tsx scripts/provider-verify.ts',
  'npx tsx scripts/startup-verify.ts',
  'npx tsx scripts/security-verify.ts',
  'npx tsx scripts/telemetry-verify.ts',
  'npx tsx scripts/storage-verify.ts',
  'npx tsx scripts/retrieval-verify.ts',
  'npx tsx scripts/agent-router-verify.ts',
  'npx tsx scripts/workflow-verify.ts',
  'npx tsx scripts/ingestion-verify.ts',
  'npx tsx scripts/indexing-verify.ts',
  'npx tsx scripts/knowledge-verify.ts',
  'npx tsx scripts/knowledge-api-verify.ts',
  'npx tsx scripts/evaluation-benchmark.ts',
  'npx tsx scripts/evaluation-run.ts'
];

function runScript(scriptCommand: string): boolean {
  try {
    logger.info(`--------------------------------------------------`);
    logger.info(`[RUNNING] ${scriptCommand}`);
    // stdio: 'inherit' streams output directly to the console
    execSync(scriptCommand, { stdio: 'inherit', cwd: process.cwd() });
    logger.info(`[PASS] ${scriptCommand}`);
    return true;
  } catch (err: any) {
    logger.error(`[FAIL] ${scriptCommand}`);
    return false;
  }
}

function verifyRelease() {
  logger.info('==================================================');
  logger.info('STARTING ENTERPRISE RELEASE CERTIFICATION');
  logger.info('==================================================');

  let failedCount = 0;

  for (const script of scriptsToRun) {
    const success = runScript(script);
    if (!success) {
      failedCount++;
      // Stop on first failure to keep it deterministic
      break; 
    }
  }

  logger.info('==================================================');
  if (failedCount === 0) {
    logger.info('RELEASE CERTIFICATION COMPLETE: 100% SUCCESS');
    logger.info('Platform is certified for production deployment.');
    process.exit(0);
  } else {
    logger.error('RELEASE CERTIFICATION FAILED.');
    logger.error('Platform is NOT certified for production deployment.');
    process.exit(1);
  }
}

verifyRelease();
