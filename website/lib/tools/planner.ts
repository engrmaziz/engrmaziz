// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { ToolCall } from './types';

export class ToolPlanner {
  /**
   * Deterministic phase 1 planner. 
   * Resolves exact paths based on query structure to avoid LLM variability during testing.
   */
  async plan(query: string, llmOutput?: string, toolOutputs: any[] = []): Promise<ToolCall | null> {
    const q = query.toLowerCase();

    if (q.includes('infinite_loop_test')) {
      // Intentionally never stopping, to trigger AgentRuntime max bounds protections
      return { tool: 'HealthTool', arguments: {} };
    }

    if (q.includes('tool_failure_test')) {
      // To test malformed schema/tools crashing
      if (toolOutputs.length === 0) {
        return { tool: 'EchoTool', arguments: { repeat: 5 } }; // missing required 'message' arg triggers failure struct
      }
      return null;
    }

    // Exact schema parsing tests, only trigger ONCE
    if (toolOutputs.length === 0) {
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
        return { tool: 'EchoTool', arguments: { repeat: 5 } };
      }
    }
    
    if (q.includes('multi_tool_test')) {
      // To test exact bounds, we trigger two tool calls and then stop
      if (toolOutputs.length < 2) {
        return { tool: 'HealthTool', arguments: {} };
      }
      return null;
    }

    return null;
  }
}

export const toolPlanner = new ToolPlanner();
