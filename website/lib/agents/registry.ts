import { Agent } from './types';

export class AgentRegistry {
  private registry = new Map<string, Agent>();

  register(agent: Agent): void {
    if (this.registry.has(agent.id)) {
      throw new Error(`Agent with id '${agent.id}' is already registered.`);
    }
    this.registry.set(agent.id, agent);
  }

  get(id: string): Agent {
    const agent = this.registry.get(id);
    if (!agent) {
      throw new Error(`Agent with id '${id}' is not registered.`);
    }
    return agent;
  }

  list(): string[] {
    return Array.from(this.registry.keys());
  }
}

export const agentRegistry = new AgentRegistry();
