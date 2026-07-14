import { ToolCall } from './types';

export class ToolPlanner {
  /**
   * Deterministic phase 1 planner. 
   * Resolves exactly one tool based on query structure to avoid LLM variability during testing.
   */
  async plan(query: string, llmOutput?: string): Promise<ToolCall | null> {
    const q = query.toLowerCase();
    
    // Exact schema parsing test
    if (q.includes('echo:')) {
      const msg = query.split('echo:')[1].trim();
      return { tool: 'EchoTool', arguments: { message: msg, repeat: 2 } };
    }
    
    if (q.includes('health') || q.includes('status')) {
      return { tool: 'HealthTool', arguments: {} };
    }
    
    if (q.includes('time') || q.includes('timezone')) {
      return { tool: 'TimeTool', arguments: { timezone: 'UTC' } };
    }

    if (q.includes('invalid_tool_test')) {
      return { tool: 'DoesNotExistTool', arguments: {} };
    }

    if (q.includes('schema_fail_test')) {
      // Missing 'message' required argument for EchoTool
      return { tool: 'EchoTool', arguments: { repeat: 5 } };
    }

    return null;
  }
}

export const toolPlanner = new ToolPlanner();
