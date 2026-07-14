import { EvaluationCase } from './types';

export const evaluationDataset: EvaluationCase[] = [
  // --- RETRIEVAL ---
  {
    id: 'retrieval_known_document',
    category: 'Retrieval',
    input: 'What database did we select for AegisFlow?',
    expectedFacts: [],
    expectedTools: [],
    expectedDocuments: [] 
  },
  {
    id: 'retrieval_dense_retrieval',
    category: 'Retrieval',
    input: 'Explain the visual editor node types.',
    expectedFacts: [],
    expectedTools: [],
    expectedDocuments: []
  },
  {
    id: 'retrieval_hybrid_retrieval',
    category: 'Retrieval',
    input: 'What is the precise maximum token limit for the LLM execution guard?',
    expectedFacts: [],
    expectedTools: [],
    expectedDocuments: []
  },

  // --- MEMORY ---
  {
    id: 'memory_multi_turn_followup',
    category: 'Memory',
    input: 'Wait, what was the first database option we considered before that?',
    expectedFacts: [],
    expectedTools: [],
    expectedDocuments: []
  },
  {
    id: 'memory_summary_recall',
    category: 'Memory',
    input: 'Summarize all the architectural constraints we discussed so far.',
    expectedFacts: [],
    expectedTools: [],
    expectedDocuments: []
  },

  // --- TOOL CALLING ---
  {
    id: 'tool_calling_healthtool',
    category: 'Tool Calling',
    input: 'Check the system health using the health tool.',
    expectedFacts: [],
    expectedTools: ['HealthTool'],
    expectedDocuments: []
  },
  {
    id: 'tool_calling_timetool',
    category: 'Tool Calling',
    input: 'What is the current server time?',
    expectedFacts: [],
    expectedTools: ['TimeTool'],
    expectedDocuments: []
  },
  {
    id: 'tool_calling_echotool',
    category: 'Tool Calling',
    input: 'echo: Alpha Bravo Charlie',
    expectedFacts: [],
    expectedTools: ['EchoTool'],
    expectedDocuments: []
  },
  {
    id: 'tool_calling_tool_failure',
    category: 'Tool Calling',
    input: 'tool_failure_test',
    expectedFacts: [],
    expectedTools: ['EchoTool'],
    expectedDocuments: []
  },

  // --- AGENT RUNTIME ---
  {
    id: 'agent_runtime_no_tool',
    category: 'Agent Runtime',
    input: 'Hello, how are you today?',
    expectedFacts: [],
    expectedTools: [],
    expectedDocuments: []
  },
  {
    id: 'agent_runtime_single_tool',
    category: 'Agent Runtime',
    input: 'Tell me the current server time.',
    expectedFacts: [],
    expectedTools: ['TimeTool'],
    expectedDocuments: []
  },
  {
    id: 'agent_runtime_multiple_tool',
    category: 'Agent Runtime',
    input: 'multi_tool_test',
    expectedFacts: [],
    expectedTools: ['HealthTool'],
    expectedDocuments: []
  },
  {
    id: 'agent_runtime_max_tool_limit',
    category: 'Agent Runtime',
    input: 'infinite_loop_test',
    expectedFacts: [],
    expectedTools: ['HealthTool'],
    expectedDocuments: []
  },
  {
    id: 'agent_runtime_failure_recovery',
    category: 'Agent Runtime',
    input: 'tool_failure_test then time',
    expectedFacts: [],
    expectedTools: ['EchoTool'],
    expectedDocuments: []
  }
];
