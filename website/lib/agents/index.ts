export * from './types';
export * from './context';
export * from './registry';
export * from './router';
export * from './base-agent';

import { agentRegistry } from './registry';
import { RAGAgent } from './implementations/rag-agent';

// Self-register the default production agent
agentRegistry.register(new RAGAgent());
