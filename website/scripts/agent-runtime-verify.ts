import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { ragOrchestrator } from '../lib/rag/orchestrator';
import { randomUUID } from 'crypto';

// Load tool instances
import '../lib/tools/instances';

async function verifyAgentRuntime() {
  console.log("\n==========================================");
  console.log("AGENT RUNTIME VERIFICATION");
  console.log("==========================================\n");

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    // 1. Zero Tools
    console.log("--- TEST 1: Zero Tools ---");
    const req1 = await ragOrchestrator.execute({ query: "What is AegisFlow?", sessionId: randomUUID() });
    const ac1 = req1.context.executionContext.metadata.agentContext;
    assert(ac1.toolCallsExecuted === 0, "Runtime skipped tools cleanly.");
    assert(ac1.terminationReason === 'completed', "Runtime terminated with 'completed'.");

    // 2. One Tool
    console.log("\n--- TEST 2: One Tool ---");
    await sleep(2000);
    const req2 = await ragOrchestrator.execute({ query: "echo: single bounce", sessionId: randomUUID() });
    const ac2 = req2.context.executionContext.metadata.agentContext;
    assert(ac2.toolCallsExecuted === 1, "Runtime executed exactly 1 tool.");
    assert(ac2.stateTransitions.some((t:any) => t.state === 'TOOLS' && t.nextState === 'LLM'), "Runtime bounced TOOLS -> LLM.");

    // 3. Two Tools
    console.log("\n--- TEST 3: Two Tools ---");
    await sleep(3000);
    const req3 = await ragOrchestrator.execute({ query: "multi_tool_test", sessionId: randomUUID() });
    const ac3 = req3.context.executionContext.metadata.agentContext;
    assert(ac3.toolCallsExecuted === 2, "Runtime successfully looped for 2 tools.");
    assert(ac3.terminationReason === 'completed', "Terminated safely after multi-tool loop.");

    // 4. Tool Failure
    console.log("\n--- TEST 4: Tool Failure Recovery ---");
    await sleep(3000);
    const req4 = await ragOrchestrator.execute({ query: "tool_failure_test", sessionId: randomUUID() });
    const ac4 = req4.context.executionContext.metadata.agentContext;
    assert(ac4.toolCallsExecuted === 1, "Attempted failed tool.");
    assert(req4.context.response.toolOutputs[0].success === false, "Tool result recorded as failure.");
    assert(ac4.terminationReason === 'completed', "Runtime did not crash and recovered safely via LLM.");

    // 5. Max Iterations Exceeded
    console.log("\n--- TEST 5: Infinite Loop Guard ---");
    await sleep(5000);
    const req5 = await ragOrchestrator.execute({ query: "infinite_loop_test", sessionId: randomUUID() });
    const ac5 = req5.context.executionContext.metadata.agentContext;
    assert(ac5.toolCallsExecuted === 3 || ac5.llmPassesExecuted === 3, "Runtime hit strict iteration limits.");
    assert(ac5.terminationReason === 'max_tools' || ac5.terminationReason === 'max_llm_passes', "Termination reason caught guard.");

    console.log(`\n==========================================`);
    if (failed === 0) {
      console.log(`SUCCESS: ${passed}/${passed} runtime checks passed. Single-Agent loop is solid.`);
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

verifyAgentRuntime().catch(console.error);
