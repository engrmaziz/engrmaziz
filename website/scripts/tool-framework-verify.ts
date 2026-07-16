// @ts-nocheck
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { toolRegistry } from '../lib/tools/registry';
import { toolExecutor } from '../lib/tools/executor';
import { ragOrchestrator } from '../lib/rag/orchestrator';
import { randomUUID } from 'crypto';

// Ensure demo tools are loaded
import '../lib/tools/instances';

async function verifyToolFramework() {
  console.log("\n==========================================");
  console.log("TOOL CALLING FRAMEWORK VERIFICATION");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`[✓] ${msg}`);
      passed++;
    } else {
      console.error(`[✗] ${msg}`);
      failed++;
    }
  }

  try {
    console.log("--- PHASE 1: REGISTRY & ABSTRACTIONS ---");
    const tools = toolRegistry.listDefinitions();
    assert(tools.length >= 3, "Registry loaded correctly with at least 3 tools.");
    assert(toolRegistry.validate('EchoTool'), "EchoTool successfully validated in Registry.");
    assert(!toolRegistry.validate('NonExistentTool'), "Unknown tool correctly rejected by Registry.");

    let duplicateErrorCaught = false;
    try {
      toolRegistry.register(tools[0] as any);
    } catch (e) {
      duplicateErrorCaught = true;
    }
    assert(duplicateErrorCaught, "Registry rejected duplicate registration.");

    console.log("\n--- PHASE 2: EXECUTOR & SCHEMAS ---");
    // 2.1 Valid Execution
    const echoRes = await toolExecutor.execute({ tool: 'EchoTool', arguments: { message: 'hello', repeat: 3 } }, 'req-1');
    assert(echoRes.success === true, "Executor successfully ran EchoTool.");
    assert(echoRes.output?.echoed === 'hello hello hello', "EchoTool returned exact deterministic output.");
    assert(!!echoRes.toolExecutionId && !!echoRes.startTime && !!echoRes.durationMs, "Execution Telemetry IDs populated.");

    // 2.2 Invalid Parameters (Schema Rejection)
    const badSchemaRes = await toolExecutor.execute({ tool: 'EchoTool', arguments: { repeat: 5 } }, 'req-2');
    assert(badSchemaRes.success === false, "Executor blocked missing parameters.");
    assert(badSchemaRes.error?.code === 'SCHEMA_VALIDATION_FAILED', "Schema Validator generated structured ToolError.");

    // 2.3 Unknown Tool
    const badToolRes = await toolExecutor.execute({ tool: 'GhostTool', arguments: {} }, 'req-3');
    assert(badToolRes.success === false && badToolRes.error?.code === 'TOOL_NOT_FOUND', "Executor gracefully blocked unknown tool.");

    // 2.4 Internal Tools Check
    const timeRes = await toolExecutor.execute({ tool: 'TimeTool', arguments: {} }, 'req-4');
    assert(timeRes.success === true && !!timeRes.output.utc, "TimeTool executed successfully.");

    const healthRes = await toolExecutor.execute({ tool: 'HealthTool', arguments: {} }, 'req-5');
    assert(healthRes.success === true && !!healthRes.output.status, "HealthTool executed successfully.");

    console.log("\n--- PHASE 3: ORCHESTRATOR INTEGRATION ---");
    
    // 3.1 Normal RAG query (No Tools)
    const ragReq = await ragOrchestrator.execute({ query: "What is AegisFlow architecture?", sessionId: randomUUID() });
    assert(ragReq.context.executionContext.telemetry.toolPlanning.status === 'SKIPPED', "Tool planning skipped when no match found.");
    assert(ragReq.context.executionContext.telemetry.toolExecution.status === 'SKIPPED', "Tool execution skipped when no tool returned.");

    // 3.2 Tool Triggered Query
    const toolReq = await ragOrchestrator.execute({ query: "echo: framework test", sessionId: randomUUID() });
    const ctx = toolReq.context;
    const tExec = ctx.executionContext.telemetry.toolExecution;
    const tPlan = ctx.executionContext.telemetry.toolPlanning;

    assert(tPlan.status === 'SUCCESS' && tPlan.durationMs >= 0, `Telemetry captured Tool Planning phase (${tPlan.durationMs}ms).`);
    assert(tExec.status === 'SUCCESS' && tExec.durationMs >= 0, `Telemetry captured Tool Execution phase (${tExec.durationMs}ms).`);
    assert(ctx.response.toolOutputs.length === 1, "RequestContext cleanly appended ToolResults to toolOutputs array.");
    assert(ctx.response.toolOutputs[0].output.echoed === 'framework test framework test', "RequestContext correctly holds the Echo output.");
    
    // 3.3 Prompt Builder
    const messages = ctx.prompt.messages;
    const sysMsg = messages.find((m: any) => m.role === 'system');
    assert(sysMsg.content.includes('--- Tool Execution Results ---'), "PromptBuilder seamlessly injected Tool outputs into system prompt.");

    console.log(`\n==========================================`);
    if (failed === 0) {
      console.log(`SUCCESS: ${passed}/${passed} checks passed. Core Tool Calling Framework is ready.`);
      process.exit(0);
    } else {
      console.log(`FAILED: ${failed} checks failed.`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error("\n[!] FATAL TEST ERROR:", error);
    process.exit(1);
  }
}

verifyToolFramework().catch(console.error);
