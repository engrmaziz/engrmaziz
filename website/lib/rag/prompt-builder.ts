/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RAG_SYSTEM_PROMPT } from './prompts';
import { getAllServices } from '../services';

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
    toolOutputs: any[] = [],
    visitorInfo?: { name: string; email: string }
  ): { role: 'system' | 'user' | 'assistant'; content: string }[] {
    let systemContent = RAG_SYSTEM_PROMPT.replace('{context}', 'See context below.');
    
    // Inject Structured Service Index for broad queries to prevent chunk-dropping omission
    if (currentQuery.toLowerCase().includes('service') || currentQuery.toLowerCase().includes('offer')) {
      try {
        const allServices = getAllServices();
        if (allServices && allServices.length > 0) {
          const serviceList = allServices.map((s) => `- ${s.title}${s.description ? `: ${s.description}` : ''}`).join('\n');
          systemContent += `\n\n--- Complete Service Catalog (Use this to ensure you do not omit any services) ---\n${serviceList}`;
        }
      } catch (e) {
        console.warn('Failed to load service index for prompt builder', e);
      }
    }

    if (visitorInfo) {
      systemContent += `\n\n--- Visitor Session Info ---\nName: ${visitorInfo.name}\nEmail: ${visitorInfo.email}\nNote: The user has already provided their name and email. Do NOT ask for them again.`;
    }

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
