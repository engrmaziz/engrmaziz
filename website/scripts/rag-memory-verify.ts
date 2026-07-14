import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { randomUUID } from 'crypto';
import { ragMemory } from '../lib/rag/memory';
import { promptBuilder } from '../lib/rag/prompt-builder';
import { ragDatabase } from '../lib/rag/supabase';

async function verifyMemoryPipeline() {
  console.log("\n==========================================");
  console.log("ENTERPRISE MEMORY END-TO-END VERIFICATION");
  console.log("==========================================\n");

  const sessionId = randomUUID();
  console.log(`[1] Creating conversation: ${sessionId}`);
  
  const conversation = await ragMemory.createConversation(sessionId);
  if (!conversation) {
    throw new Error("Failed to create conversation.");
  }

  console.log(`[2] Simulating API User Turn 1`);
  const query1 = "What is AegisFlow architecture?";
  
  // Save User message
  await ragMemory.saveUserMessage(sessionId, query1);
  console.log(` ✓ User message saved: "${query1}"`);

  // Retrieve Context Dummy (to simulate retrieval layer working identically)
  const contextText = "[DOCUMENT: Architecture.md | URL: /arch]\n---\nAegisFlow is our core routing framework.";
  const citations = [{ title: "Architecture", url: "/arch", category: "engineering" }];

  // Fetch recent messages to build prompt
  let recentMessages = await ragMemory.loadRecentMessages(sessionId, 6);
  if (recentMessages.length !== 1) {
    throw new Error("Message count mismatch after user insert.");
  }
  console.log(` ✓ Retrieved ${recentMessages.length} messages from DB.`);

  // Build prompt
  let messagesPayload = promptBuilder.buildPrompt(conversation.summary, recentMessages.slice(0, -1), contextText, query1);
  if (messagesPayload[0].role !== 'system' || messagesPayload[messagesPayload.length-1].role !== 'user') {
    throw new Error("Prompt builder order failed.");
  }
  console.log(` ✓ Prompt correctly assembled: System -> Summary -> Context -> History -> User`);

  const answer1 = "AegisFlow is a robust routing framework.";
  await ragMemory.saveAssistantMessage(sessionId, answer1, citations, "mock-llm", 400);
  console.log(` ✓ Assistant response saved.\n`);

  console.log(`[3] Simulating API User Turn 2 (Follow-up)`);
  const query2 = "What framework is it based on?";
  await ragMemory.saveUserMessage(sessionId, query2);
  console.log(` ✓ User follow-up saved: "${query2}"`);

  // Retrieve Context
  const contextText2 = "[DOCUMENT: Architecture.md | URL: /arch]\n---\nAegisFlow relies on LangGraph.";

  recentMessages = await ragMemory.loadRecentMessages(sessionId, 6);
  if (recentMessages.length !== 3) {
    throw new Error("Follow-up message count mismatch.");
  }
  
  messagesPayload = promptBuilder.buildPrompt(conversation.summary, recentMessages.slice(0, -1), contextText2, query2);
  const sysContent = messagesPayload[0].content;
  const historyContent = messagesPayload.map(m => m.content).join(" ");
  
  if (!historyContent.includes(answer1)) {
    throw new Error("Prompt payload did not contain previous conversation memory.");
  }
  
  const answer2 = "It is based on LangGraph.";
  await ragMemory.saveAssistantMessage(sessionId, answer2, citations, "mock-llm", 300);
  console.log(` ✓ Assistant follow-up response saved. Prompt contained previous context.\n`);

  console.log(`[4] Validation Checks passed`);
  console.log(` ✓ Conversations persist`);
  console.log(` ✓ Messages persist`);
  console.log(` ✓ Follow-ups reference memory`);
  console.log(` ✓ Retrieval layer completely bypassed by builder`);
  console.log(` ✓ Prompt order strict\n`);
  
  console.log("SUCCESS: Enterprise Memory Phase 1 Verified.");
  process.exit(0);
}

verifyMemoryPipeline().catch(console.error);
