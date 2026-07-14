export * from './types';
export * from './context';
export * from './base-workflow';
export * from './registry';
export * from './router';

import { DefaultWorkflow } from './implementations/default-workflow';
import { workflowRegistry } from './registry';

// Statically register default workflow
workflowRegistry.register(new DefaultWorkflow());
