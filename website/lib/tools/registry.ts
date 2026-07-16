/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Tool } from './types';

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`ToolRegistrationError: Tool '${tool.name}' is already registered.`);
    }
    this.tools.set(tool.name, tool);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  listDefinitions(): Array<{ name: string; description: string; version: string; schema: Record<string, any> }> {
    return Array.from(this.tools.values()).map(t => ({
      name: t.name,
      description: t.description,
      version: t.version,
      schema: t.schema
    }));
  }

  validate(name: string): boolean {
    return this.tools.has(name);
  }
}

export const toolRegistry = new ToolRegistry();
