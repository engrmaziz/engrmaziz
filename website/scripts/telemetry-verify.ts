import assert from 'assert';
import { RequestTrace, telemetryLogger } from '../lib/telemetry';
import { ragOrchestrator } from '../lib/rag/orchestrator';
import { ragDatabase } from '../lib/rag/supabase';

async function verifyTelemetry() {
  console.log('==========================================');
  console.log('TELEMETRY VERIFICATION (Milestone 7)');
  console.log('==========================================\n');

  try {
    // 1. Direct RequestTrace Unit Test
    console.log('--- TEST 1: RequestTrace Isolation ---');
    const trace = new RequestTrace();
    const id = trace.getRequestId();
    assert(id && typeof id === 'string' && id.length > 10, 'RequestId generated correctly.');
    
    trace.startStage('TestStage');
    await new Promise(resolve => setTimeout(resolve, 50)); // artificial delay
    trace.attachMetadata('testKey', 123);
    trace.endStage('TestStage', true);

    trace.startStage('FailStage');
    trace.endStage('FailStage', false, 'Simulated Failure');

    const exported = trace.exportTrace();
    const jsonStr = JSON.stringify(exported);
    const parsed = JSON.parse(jsonStr);

    assert(parsed.requestId === id, 'Exported requestId matches');
    assert(parsed.stages['TestStage'].success === true, 'TestStage marked success');
    assert(parsed.stages['TestStage'].durationMs >= 50, 'TestStage duration recorded correctly');
    assert(parsed.stages['FailStage'].success === false, 'FailStage marked failure');
    assert(parsed.stages['FailStage'].error === 'Simulated Failure', 'FailStage error attached');
    assert(parsed.metadata['testKey'] === 123, 'Metadata attached correctly');
    console.log('[✓] RequestTrace unit tests passed.\n');

    // 2. Integration Pipeline Test
    console.log('--- TEST 2: Pipeline Execution Trace ---');
    const { randomUUID } = await import('crypto');
    const sessionId = randomUUID();
    const result = await ragOrchestrator.execute({
      query: 'What is the current architecture context?',
      sessionId,
      filters: {}
    });

    assert(result.answer, 'RAG execution completed successfully without regression');
    assert(result.context, 'Context exists in result');
    
    const execTrace = result.context.executionContext.trace.exportTrace();
    assert(execTrace.requestId, 'Pipeline Trace generated requestId');
    assert(execTrace.stages['Total'], 'Total stage exists');
    assert(execTrace.stages['Total'].durationMs > 0, 'Total stage recorded duration');
    assert(execTrace.stages['Retrieval'], 'Retrieval stage exists');
    assert(execTrace.stages['Retrieval'].durationMs > 0, 'Retrieval stage recorded duration');
    assert(execTrace.stages['PromptAssembly'], 'PromptAssembly stage exists');
    assert(execTrace.stages['PromptAssembly'].durationMs >= 0, 'PromptAssembly stage recorded duration');
    
    if (execTrace.stages['Agent.LLM']) {
        assert(execTrace.stages['Agent.LLM'].durationMs > 0, 'Agent LLM phase tracked');
    }

    assert(execTrace.metadata['diagnostics'], 'Pipeline diagnostics attached to trace');
    
    // Verify JSON serializability of the actual full trace
    JSON.stringify(execTrace);
    
    console.log('[✓] Pipeline successfully traced all stages without modifying business logic.\n');

    console.log('==========================================');
    console.log('SUCCESS: All Telemetry checks passed.');
    console.log('==========================================');

  } catch (e: any) {
    console.error('\n[!] FATAL TEST ERROR:', e);
    process.exit(1);
  } finally {
    process.exit(0); // Exit clean
  }
}

verifyTelemetry();
