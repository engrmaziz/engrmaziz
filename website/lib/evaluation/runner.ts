// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { ragOrchestrator } from '../rag/orchestrator';
import { EvaluationSuite, EvaluationReport, EvaluationResult, EvaluationStatistics } from './types';
import { EvaluationValidator } from './validator';
import { EvaluationExecutionError } from './errors';
import { extractRetrievalCount, extractLlmCalls, extractToolCalls } from './metrics';
import { randomUUID } from 'crypto';

export class EvaluationRunner {
  private validator: EvaluationValidator;

  constructor() {
    this.validator = new EvaluationValidator();
  }

  public async runSuite(suite: EvaluationSuite): Promise<EvaluationReport> {
    this.validator.validate(suite);

    const results: EvaluationResult[] = [];
    let passed = 0;
    let failed = 0;
    let totalLatency = 0;
    let totalRetrievalCount = 0;
    let totalLlmCalls = 0;
    let totalToolInvocationCount = 0;
    let errorCount = 0;

    for (const testCase of suite.cases) {
      if (results.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      const start = Date.now();

      try {
        const result = await ragOrchestrator.execute({
          query: testCase.input,
          sessionId: randomUUID(),
          filters: {},
          flags: { bypassCache: true }
        });

        const durationMs = Date.now() - start;
        totalLatency += durationMs;

        const traceExport = result.context.executionContext.trace.exportTrace();

        // Pass tool outputs to trace context to extract metrics if missing
        traceExport.metadata['toolOutputs'] = result.context.response.toolOutputs;

        const retrievalCount = extractRetrievalCount(traceExport);
        const llmCalls = extractLlmCalls(traceExport);
        const toolCalls = extractToolCalls(traceExport);

        totalRetrievalCount += retrievalCount;
        totalLlmCalls += llmCalls;
        totalToolInvocationCount += toolCalls;

        // Deterministic Assertions
        let status: 'PASS' | 'FAIL' = 'PASS';
        let failureReason: string | undefined;

        const lowerResponse = (result.answer || '').toLowerCase();
        for (const fact of testCase.expectedFacts) {
          if (!lowerResponse.includes(fact.toLowerCase())) {
            status = 'FAIL';
            failureReason = `Response missing expected fact: "${fact}"`;
            break;
          }
        }

        if (status === 'PASS' && testCase.expectedTools.length > 0) {
          const executedTools = (result.context.response.toolOutputs || []).map((t: any) => t.toolName);
          for (const expectedTool of testCase.expectedTools) {
            if (!executedTools.includes(expectedTool)) {
              status = 'FAIL';
              failureReason = `Expected tool not executed: "${expectedTool}"`;
              break;
            }
          }
        }

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

        results.push({
          id: testCase.id,
          category: testCase.category,
          status,
          durationMs,
          failureReason,
          metrics: {
            retrievalCount,
            llmCalls,
            toolCalls
          }
        });

        if (status === 'PASS') passed++;
        else failed++;

      } catch (err: any) {
        const durationMs = Date.now() - start;
        totalLatency += durationMs;
        failed++;
        errorCount++;
        
        results.push({
          id: testCase.id,
          category: testCase.category,
          status: 'FAIL',
          durationMs,
          failureReason: `Pipeline Exception: ${err.message}`,
          metrics: { retrievalCount: 0, llmCalls: 0, toolCalls: 0 }
        });
      }
    }

    // Stable Sorting
    results.sort((a, b) => a.id.localeCompare(b.id));

    const totalTests = suite.cases.length;
    const statistics: EvaluationStatistics = {
      totalTests,
      passed,
      failed,
      successRate: totalTests > 0 ? passed / totalTests : 0,
      averageLatency: totalTests > 0 ? totalLatency / totalTests : 0,
      averageRetrievalCount: totalTests > 0 ? totalRetrievalCount / totalTests : 0,
      averageLlmCalls: totalTests > 0 ? totalLlmCalls / totalTests : 0,
      toolInvocationCount: totalToolInvocationCount,
      errorCount
    };

    return Object.freeze({
      timestamp: new Date().toISOString(),
      gitCommit: null, // Let external scripts append this if desired, keeping runner pure
      suiteId: suite.id,
      statistics: Object.freeze(statistics),
      results: Object.freeze(results) as any
    });
  }
}
