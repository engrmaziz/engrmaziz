import { RAG_SYSTEM_PROMPT } from './prompts';

export class PromptBuilder {
  /**
   * Assembles the final LLM prompt strictly following the enterprise order:
   * System Prompt -> Summary -> Recent Messages -> RAG Context -> User Query
   */
  buildPrompt(
    summary: string | null,
    recentMessages: { role: string; content: string }[],
    ragContext: string,
    currentQuery: string,
    toolOutputs: any[] = []
  ): { role: 'system' | 'user' | 'assistant'; content: string }[] {
    let systemContent = RAG_SYSTEM_PROMPT.replace('{context}', 'See context below.');
    
    if (summary) {
      systemContent += `\n\n--- Conversation Summary ---\n${summary}`;
    }

    systemContent += `\n\n--- RAG Context ---\n${ragContext}`;

    if (toolOutputs && toolOutputs.length > 0) {
      systemContent += `\n\n--- Tool Execution Results ---\n`;
      for (const t of toolOutputs) {
        systemContent += `Tool [${t.toolName}]: ${JSON.stringify(t.output || t.error)}\n`;
      }
    }

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemContent }
    ];

    for (const msg of recentMessages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: 'user', content: currentQuery });

    return messages;
  }
}

export const promptBuilder = new PromptBuilder();
