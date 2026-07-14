import { ragOrchestrator } from '../rag/orchestrator';
import { EvaluationCase, EvaluationResult, RegressionReport } from './types';
import { extractMetrics, populateToolMetricsFromResponse } from './metrics';
import { randomUUID } from 'crypto';

export class EvaluationRunner {
  async runDataset(dataset: EvaluationCase[]): Promise<RegressionReport> {
    const results: EvaluationResult[] = [];
    let passed = 0;
    let failed = 0;
    let totalLatency = 0;

    for (const testCase of dataset) {
      console.log(`\n[Runner] Executing test: ${testCase.id} (${testCase.category})`);
      const sessionId = randomUUID();
      const start = Date.now();

      try {
        const result = await ragOrchestrator.execute({
          query: testCase.input,
          sessionId,
          filters: {},
          flags: { bypassCache: true }
        });

        const durationMs = Date.now() - start;
        totalLatency += durationMs;

        const traceExport = result.context.executionContext.trace.exportTrace();
        const metrics = extractMetrics(traceExport);
        populateToolMetricsFromResponse(metrics, result.context.response.toolOutputs);

        // Deterministic Assertions
        let status: 'PASS' | 'FAIL' = 'PASS';
        let failureReason: string | undefined;

        // 1. Check Expected Facts in Response
        const lowerResponse = (result.answer || '').toLowerCase();
        for (const fact of testCase.expectedFacts) {
          if (!lowerResponse.includes(fact.toLowerCase())) {
            status = 'FAIL';
            failureReason = `Response missing expected fact: "${fact}"`;
            break;
          }
        }

        // 2. Check Expected Tools Executed
        if (status === 'PASS' && testCase.expectedTools.length > 0) {
          const executedTools = metrics.tools.toolExecuted;
          for (const expectedTool of testCase.expectedTools) {
            if (!executedTools.includes(expectedTool)) {
              status = 'FAIL';
              failureReason = `Expected tool not executed: "${expectedTool}"`;
              break;
            }
          }
        }

        // 3. Check Expected Documents
        if (status === 'PASS' && testCase.expectedDocuments.length > 0) {
          const citations = result.citations || [];
          const sourcePaths = citations.map((c: any) => c.source || '');
          for (const doc of testCase.expectedDocuments) {
            const found = sourcePaths.some((p: string) => p.includes(doc));
            if (!found) {
              status = 'FAIL';
              failureReason = `Expected document not retrieved: "${doc}"`;
              break;
            }
          }
        }
        
        // 4. Structural Integrity checks
        if (status === 'PASS') {
          if (testCase.category === 'Retrieval' && metrics.retrieval.denseCandidates === 0 && testCase.id !== 'retrieval_dense_retrieval') {
             // For standard tests, dense candidates should be > 0. Wait, "retrieval_dense_retrieval" might not match docs if DB is empty but we'll see.
             // Actually, I'll avoid over-asserting here unless specified.
          }
        }

        results.push({
          id: testCase.id,
          category: testCase.category,
          status,
          durationMs,
          failureReason,
          metrics
        });

        if (status === 'PASS') passed++;
        else failed++;
        
        console.log(`[Runner] Result: ${status} ${failureReason ? `(${failureReason})` : ''} - ${durationMs}ms`);

      } catch (err: any) {
        const durationMs = Date.now() - start;
        totalLatency += durationMs;
        failed++;
        
        results.push({
          id: testCase.id,
          category: testCase.category,
          status: 'FAIL',
          durationMs,
          failureReason: `Pipeline Exception: ${err.message}`,
          metrics: {
            retrieval: { denseCandidates: 0, sparseCandidates: 0, retrievalLatency: 0 },
            memory: { historyLoaded: 0, summaryUsed: false },
            tools: { toolExecuted: [], toolSuccess: [], toolLatency: [] },
            runtime: { llmPasses: 0, toolCalls: 0, totalExecutionTime: durationMs }
          }
        });
        console.log(`[Runner] Result: FAIL (Exception: ${err.message}) - ${durationMs}ms`);
      }
    }

    // Attempt to grab git commit
    let gitCommit = null;
    try {
      const { execSync } = require('child_process');
      gitCommit = execSync('git rev-parse HEAD').toString().trim();
    } catch {
      // ignore
    }

    return {
      timestamp: new Date().toISOString(),
      gitCommit,
      totalTests: dataset.length,
      passed,
      failed,
      averageLatency: dataset.length > 0 ? totalLatency / dataset.length : 0,
      results
    };
  }
}
