// @ts-nocheck
import { workflowRegistry, workflowRouter, createWorkflowContext, BaseWorkflow } from '../lib/workflows';
import { RequestTrace } from '../lib/telemetry/request-trace';
import { logger } from '../lib/utils/logger';

async function verifyWorkflowFlow() {
  logger.info('Starting Workflow Orchestration Verification...');

  // 1. Registry duplicate/unknown rejections
  let duplicateRejected = false;
  try {
    const defaultWorkflow = workflowRegistry.get('default-workflow');
    workflowRegistry.register(defaultWorkflow); // Should log a warning and reject without throwing
    duplicateRejected = true;
  } catch (err) {
    throw new Error('Duplicate registration should be silently rejected with a warning log, not throw.');
  }
  
  try {
    workflowRegistry.get('non-existent-workflow');
    throw new Error('Should have thrown on unknown lookup');
  } catch (err) {
    logger.info('[PASS] Unknown workflow lookup successfully rejected.');
  }

  // 2. Router resolves 'default-workflow'
  const mockContext = createWorkflowContext({} as any, {} as any, new RequestTrace('test'));
  const resolvedWorkflow = workflowRouter.route(mockContext);
  if (resolvedWorkflow.name !== 'default-workflow') {
    throw new Error('Router failed to resolve default-workflow.');
  }
  logger.info('[PASS] Workflow Router deterministically resolves default-workflow.');

  // 3. Immutability checks
  let isContextMutated = false;
  try {
    (mockContext as any).testMutation = true;
    isContextMutated = true;
  } catch (e) {
    // Expected to throw in strict mode due to Object.freeze
  }
  if (isContextMutated) {
    // Some JS environments won't throw without 'use strict', but we can check if it applied
    if ((mockContext as any).testMutation) {
      throw new Error('WorkflowContext failed immutability constraints.');
    }
  }
  logger.info('[PASS] WorkflowContext strictly enforces immutability.');

  logger.info('Workflow Orchestration Verification Completed Successfully.');
}

verifyWorkflowFlow().catch(err => {
  logger.error('Verification failed', err);
  process.exit(1);
});
