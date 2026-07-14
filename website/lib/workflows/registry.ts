import { Workflow } from './types';
import { telemetryLogger } from '../telemetry';

class WorkflowRegistry {
  private workflows: Map<string, Workflow> = new Map();

  register(workflow: Workflow): void {
    if (this.workflows.has(workflow.name)) {
      telemetryLogger.log('SYSTEM', `Warning: Attempted to register duplicate workflow "${workflow.name}". Registration rejected.`);
      return;
    }
    this.workflows.set(workflow.name, workflow);
    telemetryLogger.log('SYSTEM', `Registered workflow: ${workflow.name}`);
  }

  get(name: string): Workflow {
    const workflow = this.workflows.get(name);
    if (!workflow) {
      throw new Error(`Workflow not found: ${name}`);
    }
    return workflow;
  }

  list(): string[] {
    return Array.from(this.workflows.keys());
  }
}

export const workflowRegistry = new WorkflowRegistry();
