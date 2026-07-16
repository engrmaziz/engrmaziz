// @ts-nocheck
import { RequestTrace, generateTraceSummary, exportTrace, redactSensitiveData } from '../lib/telemetry';
import { logger } from '../lib/utils/logger';

async function verifyTelemetryFlow() {
  logger.info('Starting Telemetry & Observability Verification...');

  // 1. Create a dummy trace with sensitive data and simulated stages
  const trace = new RequestTrace('test-req-123');
  trace.attachMetadata('user', 'admin');
  trace.attachMetadata('authorization', 'Bearer my-super-secret-token');
  trace.attachMetadata('cookie', 'session=abc123xyz');
  trace.attachMetadata('diagnostics', {
    agentLlmPasses: 2,
    agentToolCalls: 1,
    agentToolFailures: 0,
    retrievedCandidateCount: 5,
    memoryMessagesLoaded: 10,
    agentTerminationReason: 'completed'
  });

  trace.startStage('Memory');
  trace.endStage('Memory');
  
  // Force simulate duration for deterministic summary test
  const traceData = trace.exportTrace();
  if (traceData.stages['Memory']) {
    traceData.stages['Memory'].startTime = 1000;
    traceData.stages['Memory'].endTime = 1500;
    traceData.stages['Memory'].durationMs = 500;
  }
  
  traceData.stages['Retrieval'] = {
    stageName: 'Retrieval',
    startTime: 1500,
    endTime: 2000,
    durationMs: 500,
    success: true
  };

  // 2. Summary Generation Test
  const summary = generateTraceSummary(traceData);
  if (summary.totalDurationMs !== 1000) {
    throw new Error(`Summary totalDurationMs mismatch. Expected 1000, got ${summary.totalDurationMs}`);
  }
  if (summary.memoryDurationMs !== 500) {
    throw new Error(`Summary memoryDurationMs mismatch. Expected 500, got ${summary.memoryDurationMs}`);
  }
  if (summary.llmPasses !== 2 || summary.toolCalls !== 1 || summary.memoryMessagesLoaded !== 10) {
    throw new Error('Summary diagnostic mappings are incorrect.');
  }
  logger.info('[PASS] Summary accurately derived from existing trace.');

  // 3. Redaction Test
  const redacted = redactSensitiveData(traceData);
  if (redacted.metadata.authorization !== '***REDACTED***' || redacted.metadata.cookie !== '***REDACTED***') {
    throw new Error('Redaction failed to mask sensitive keys.');
  }
  if (redacted.metadata.user !== 'admin') {
    throw new Error('Redaction incorrectly masked non-sensitive data.');
  }
  logger.info('[PASS] Deterministic redaction successfully masked sensitive values without removing keys.');

  // 4. Exporter Immutability Test
  const originalJson = JSON.stringify(traceData);
  const exportedString1 = exportTrace(traceData);
  const afterExportJson = JSON.stringify(traceData);
  if (originalJson !== afterExportJson) {
    throw new Error('exportTrace mutated the original source trace.');
  }
  logger.info('[PASS] Exporter honors strict immutability constraint.');

  // 5. Stable Key Ordering & Zero Leakage Test
  const exportedString2 = exportTrace(traceData);
  if (exportedString1 !== exportedString2) {
    throw new Error('exportTrace serialization is not deterministic/stable.');
  }
  if (exportedString1.includes('my-super-secret-token') || exportedString1.includes('abc123xyz')) {
    throw new Error('exportTrace leaked sensitive data into serialized output.');
  }
  logger.info('[PASS] Exporter produces stable, deterministic, redacted JSON serialization.');

  logger.info('Telemetry & Observability Verification Completed Successfully.');
}

verifyTelemetryFlow().catch(err => {
  logger.error('Verification failed', err);
  process.exit(1);
});
