export interface EvaluationCase {
  id: string;
  category: string;
  input: string;
  expectedFacts: string[];
  expectedTools: string[];
  expectedDocuments: string[];
}

export interface EvaluationMetrics {
  retrieval: {
    denseCandidates: number;
    sparseCandidates: number;
    retrievalLatency: number;
  };
  memory: {
    historyLoaded: number;
    summaryUsed: boolean;
  };
  tools: {
    toolExecuted: string[];
    toolSuccess: boolean[];
    toolLatency: number[];
  };
  runtime: {
    llmPasses: number;
    toolCalls: number;
    totalExecutionTime: number;
  };
}

export interface EvaluationResult {
  id: string;
  category: string;
  status: 'PASS' | 'FAIL';
  durationMs: number;
  failureReason?: string;
  metrics: EvaluationMetrics;
}

export interface RegressionReport {
  timestamp: string;
  gitCommit: string | null;
  totalTests: number;
  passed: number;
  failed: number;
  averageLatency: number;
  results: EvaluationResult[];
}
