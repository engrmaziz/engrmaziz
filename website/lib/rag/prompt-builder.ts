/* eslint-disable @typescript-eslint/no-explicit-any */
import { RAG_SYSTEM_PROMPT } from './prompts';
import { RAG_IDENTITY_FACTS, getCompactServiceCatalog } from './identity';

export class PromptBuilder {
  buildPrompt(
    summary: string | null,
    recentMessages: { role: string; content: string }[],
    ragContext: string,
    currentQuery: string,
    toolOutputs: any[] = [],
    visitorInfo?: { name: string; email: string }
  ): { role: 'system' | 'user' | 'assistant'; content: string }[] {
    let systemContent = RAG_SYSTEM_PROMPT
      .replace('{identity}', RAG_IDENTITY_FACTS)
      .replace('{catalog}', getCompactServiceCatalog())
      .replace('{context}', ragContext || 'No additional source excerpts were retrieved.');

    if (visitorInfo) {
      systemContent += `\n\nVisitor: ${visitorInfo.name} <${visitorInfo.email}>. Do not ask for name or email again.`;
    }

    if (summary) {
      systemContent += `\n\nConversation summary:\n${summary.slice(0, 600)}`;
    }

    if (toolOutputs && toolOutputs.length > 0) {
      systemContent += `\n\nTool results:\n`;
      for (const t of toolOutputs) {
        systemContent += `- ${t.toolName || t.tool}: ${JSON.stringify(t.output || t.error).slice(0, 400)}\n`;
      }
    }

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemContent }
    ];

    const trimmedHistory = recentMessages.slice(-4);
    for (const msg of trimmedHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: (msg.content || '').slice(0, 500)
        });
      }
    }

    messages.push({ role: 'user', content: currentQuery });
    return messages;
  }
}

export const promptBuilder = new PromptBuilder();
