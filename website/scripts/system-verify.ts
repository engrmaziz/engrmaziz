// @ts-nocheck
import { systemConfig } from '../lib/system/config';
import { checkHealth } from '../lib/system/health';
import { checkReadiness } from '../lib/system/readiness';
import { validateStartup } from '../lib/system/startup';
import { getSystemVersion } from '../lib/system/version';
import { providerRegistry } from '../lib/providers/registry';
import { toolRegistry } from '../lib/tools/registry';
import { agentRegistry } from '../lib/agents/registry';
import { logger } from '../lib/utils/logger';

async function verifySystemLayer() {
  logger.info('Starting System Layer Verification...');

  // 1. Immutable configuration check
  if (!Object.isFrozen(systemConfig)) {
    throw new Error('systemConfig is not immutable (frozen).');
  }

  // 2. Run startup validation (bootstraps registries, checks health, checks readiness)
  try {
    validateStartup();
    logger.info('Startup validation passed.');
  } catch (err: any) {
    logger.error('Startup validation failed unexpectedly', err);
    throw err;
  }

  // 3. Registries initialized
  if (providerRegistry.listProviders().length === 0) {
    throw new Error('Provider registry is empty.');
  }
  if (agentRegistry.list().length === 0) {
    throw new Error('Agent registry is empty.');
  }
  if (toolRegistry.listDefinitions().length === 0) {
    throw new Error('Tool registry is empty.');
  }

  // 4. Version Check
  const version = getSystemVersion();
  if (!version.version || !version.environment) {
    throw new Error('System version metadata is missing required fields.');
  }

  logger.info('System Layer Verification Completed Successfully.');
}

verifySystemLayer().catch((err) => {
  logger.error('Verification failed', err);
  process.exit(1);
});
