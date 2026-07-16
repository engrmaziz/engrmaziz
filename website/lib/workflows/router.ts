// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { workflowRegistry } from './registry';
import { Workflow } from './types';
import { WorkflowContext } from './types';

export class WorkflowRouter {
  route(context: WorkflowContext): Workflow {
    // Deterministic resolution. No dynamic routing logic.
    return workflowRegistry.get('default-workflow');
  }
}

export const workflowRouter = new WorkflowRouter();
