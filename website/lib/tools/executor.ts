// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { randomUUID } from 'crypto';
import { toolRegistry } from './registry';
import { ToolCall, ToolResult, ToolError } from './types';
import { validateSchema } from './schemas';

export class ToolExecutor {
  async execute(toolCall: ToolCall, requestId: string): Promise<ToolResult> {
    const startTime = Date.now();
    const toolExecutionId = randomUUID();
    
    const createResult = (success: boolean, output?: any, error?: ToolError, toolVersion: string = 'unknown'): ToolResult => {
      const endTime = Date.now();
      return {
        success,
        toolExecutionId,
        requestId,
        toolName: toolCall.tool,
        startTime,
        endTime,
        durationMs: endTime - startTime,
        output,
        error,
        toolVersion
      };
    };

    const tool = toolRegistry.get(toolCall.tool);
    if (!tool) {
      return createResult(false, undefined, {
        code: 'TOOL_NOT_FOUND',
        message: `Tool '${toolCall.tool}' is not registered in the ToolRegistry.`,
        retryable: false
      });
    }

    // Schema Validation
    const schemaErrors = validateSchema(toolCall.arguments, tool.schema);
    if (schemaErrors.length > 0) {
      return createResult(false, undefined, {
        code: 'SCHEMA_VALIDATION_FAILED',
        message: `Validation failed: ${schemaErrors.join(', ')}`,
        retryable: false
      }, tool.version);
    }

    // Strict execution loop preventing Orchestrator crashes
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tool execution timed out after 10000ms')), 10000);
      });
      
      const executionPromise = tool.execute(toolCall.arguments);
      const rawOutput = await Promise.race([executionPromise, timeoutPromise]);
      
      return createResult(true, rawOutput, undefined, tool.version);
    } catch (err: any) {
      return createResult(false, undefined, {
        code: 'EXECUTION_FAILED',
        message: err.message || String(err),
        retryable: true 
      }, tool.version);
    }
  }
}

export const toolExecutor = new ToolExecutor();
