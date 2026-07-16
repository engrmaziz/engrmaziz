export type { AgentContext } from './context';
import { AgentContext } from './context';

export interface AgentResponse {
  content: string;
  model: string;
}

export interface Agent {
  readonly id: string;
  readonly description: string;

  execute(context: Readonly<AgentContext>): Promise<AgentResponse>;
}
