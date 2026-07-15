export interface EvaluationCase {
  id: string;
  category: string;
  input: string;
  expectedFacts: string[];
  expectedTools: string[];
  expectedDocuments: string[];
}

export interface EvaluationSuite {
  id: string;
  name: string;
  description: string;
  cases: EvaluationCase[];
}

export interface EvaluationMetric {
  name: string;
  value: number;
}

export interface EvaluationStatistics {
  totalTests: number;
  passed: number;
  failed: number;
  successRate: number;
  averageLatency: number;
  averageRetrievalCount: number;
  averageLlmCalls: number;
  toolInvocationCount: number;
  errorCount: number;
}

export interface EvaluationResult {
  id: string;
  category: string;
  status: 'PASS' | 'FAIL';
  durationMs: number;
  failureReason?: string;
  metrics: {
    retrievalCount: number;
    llmCalls: number;
    toolCalls: number;
  };
}

export interface EvaluationReport {
  timestamp: string;
  gitCommit: string | null;
  suiteId: string;
  statistics: EvaluationStatistics;
  results: EvaluationResult[];
}
