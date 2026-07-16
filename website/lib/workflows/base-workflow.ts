// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Workflow, WorkflowContext, WorkflowResult, WorkflowState, WorkflowStep } from './types';
import { telemetryLogger } from '../telemetry';

export abstract class BaseWorkflow implements Workflow {
  public abstract name: string;
  protected steps: WorkflowStep[] = [];

  public async execute(context: WorkflowContext): Promise<WorkflowResult> {
    const trace = context.trace;
    let state: WorkflowState = 'IDLE';

    telemetryLogger.log('WORKFLOW', `Starting workflow ${this.name}`);
    trace.startStage(`Workflow:${this.name}`);
    
    state = 'RUNNING';

    try {
      let finalResult: WorkflowResult | null = null;

      for (const step of this.steps) {
        telemetryLogger.log('WORKFLOW', `Executing step: ${step.name}`);
        trace.startStage(`WorkflowStep:${step.name}`);
        
        try {
          const result = await step.execute(context);
          if (result) {
            finalResult = result;
          }
          trace.endStage(`WorkflowStep:${step.name}`, true);
        } catch (error: any) {
          trace.endStage(`WorkflowStep:${step.name}`, false, error.message);
          throw error;
        }
      }

      state = 'COMPLETED';
      trace.endStage(`Workflow:${this.name}`, true);
      telemetryLogger.log('WORKFLOW', `Workflow ${this.name} completed successfully`);

      if (!finalResult) {
        throw new Error(`Workflow ${this.name} completed but returned no result`);
      }

      return finalResult;
    } catch (error: any) {
      state = 'FAILED';
      trace.endStage(`Workflow:${this.name}`, false, error.message);
      telemetryLogger.error('WORKFLOW', `Workflow ${this.name} failed`, error);
      throw error; // Let errors propagate up via the existing execution chain
    }
  }
}
