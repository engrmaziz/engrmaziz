import { Agent, AgentResponse } from './types';
import { AgentContext } from './context';
import { telemetryLogger } from '../telemetry';

export abstract class BaseAgent implements Agent {
  abstract readonly id: string;
  abstract readonly description: string;

  async execute(context: Readonly<AgentContext>): Promise<AgentResponse> {
    context.trace.startStage(`Agent.${this.id}`);
    telemetryLogger.log('AGENT', `Executing agent ${this.id}`);
    
    try {
      const response = await this.doExecute(context);
      context.trace.endStage(`Agent.${this.id}`, true);
      telemetryLogger.log('AGENT', `Agent ${this.id} execution completed`);
      return response;
    } catch (err: any) {
      context.trace.endStage(`Agent.${this.id}`, false, err.message);
      telemetryLogger.error('AGENT', `Agent ${this.id} execution failed`, err);
      throw err;
    }
  }

  protected abstract doExecute(context: Readonly<AgentContext>): Promise<AgentResponse>;
}
