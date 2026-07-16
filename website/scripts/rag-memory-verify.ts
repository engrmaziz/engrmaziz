// @ts-nocheck
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { ragOrchestrator } from '../lib/rag/orchestrator';
import { ragSummary, ragMemory } from '../lib/rag/memory';
import { randomUUID } from 'crypto';
import { ragDatabase } from '../lib/rag/supabase';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function verifyMemorySummarization() {
  console.log("\n==========================================");
  console.log("LONG-TERM MEMORY & SUMMARIZATION VERIFICATION");
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
    const sessionId = randomUUID();
    
    console.log("--- TEST 1: Under Limit ---");
    // Insert 5 messages manually
    await ragMemory.createConversation(sessionId);
    for (let i = 0; i < 5; i++) {
      await ragMemory.saveUserMessage(sessionId, `Hello ${i}`);
      await ragMemory.saveAssistantMessage(sessionId, `Hi ${i}`);
    }
    
    // Trigger summarizer
    await ragSummary.triggerAsyncSummarization(sessionId);
    const conv1 = await ragMemory.loadConversation(sessionId);
    assert(!conv1.summary, "No summary generated for short conversation.");
    assert(conv1.summary_message_count === 0 || conv1.summary_message_count === null, "Message count remains 0.");

    console.log("\n--- TEST 2: Exceeds Limit ---");
    // Insert 20 more messages to cross the 20 threshold
    for (let i = 0; i < 10; i++) {
      await ragMemory.saveUserMessage(sessionId, `We decided to use PostgreSQL for the database.`);
      await ragMemory.saveAssistantMessage(sessionId, `Acknowledged, PostgreSQL recorded as the database.`);
    }
    await ragSummary.triggerAsyncSummarization(sessionId);
    
    const conv2 = await ragMemory.loadConversation(sessionId);
    assert(!!conv2.summary, "Summary successfully generated once limit exceeded.");
    assert(conv2.summary_message_count === 30, "Summary message count tracks exact number of archived messages (30).");
    assert(conv2.summary.toLowerCase().includes('postgresql'), "Summary successfully preserved critical factual decisions.");

    console.log("\n--- TEST 3: Conversation Continues ---");
    await ragMemory.saveUserMessage(sessionId, "Are there any unresolved issues?");
    await ragSummary.triggerAsyncSummarization(sessionId);
    
    const conv3 = await ragMemory.loadConversation(sessionId);
    assert(conv3.summary_message_count === 30, "Summarizer ignored the new message because it's under the threshold.");
    
    console.log("\n--- TEST 4: Context Recall ---");
    await sleep(2000); // safety buffer for rate limits
    const recallReq = await ragOrchestrator.execute({ query: "What database did we decide to use?", sessionId });
    assert(recallReq.context.memory.history.length === 1, "Orchestrator fetched exactly the 1 unsummarized message.");
    assert(!!recallReq.context.memory.summary, "Orchestrator successfully loaded the unified summary into the PromptBuilder.");
    assert(recallReq.context.response.assistantResponse.toLowerCase().includes('postgresql'), "LLM successfully recalled fact from the archived summary!");

    console.log("\n--- TEST 5: Double Summarization (No Recursive Loss) ---");
    // Inject 22 more messages (Total 55, 30 summarized, 25 unsummarized due to previous tests)
    for (let i = 0; i < 11; i++) {
      await ragMemory.saveUserMessage(sessionId, `We also need to implement Redis caching.`);
      await ragMemory.saveAssistantMessage(sessionId, `Redis caching added to requirements.`);
    }
    await sleep(2000); // LLM buffer
    await ragSummary.triggerAsyncSummarization(sessionId);
    
    const conv5 = await ragMemory.loadConversation(sessionId);
    assert(conv5.summary_message_count === 55, "Message count accurately updated to 55.");
    assert(conv5.summary.toLowerCase().includes('postgresql') && conv5.summary.toLowerCase().includes('redis'), "Unified summary retained both OLD facts and NEW facts without recursive loss.");

    console.log(`\n==========================================`);
    if (failed === 0) {
      console.log(`SUCCESS: ${passed}/${passed} memory checks passed. Pruning limits are robust.`);
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

verifyMemorySummarization().catch(console.error);
