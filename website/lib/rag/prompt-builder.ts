/* eslint-disable @typescript-eslint/no-explicit-any */
import { RAG_SYSTEM_PROMPT, RAG_VOICE_SYSTEM_PROMPT } from './prompts';
import { RAG_IDENTITY_FACTS, getCompactServiceCatalog } from './identity';

export class PromptBuilder {
  buildPrompt(
    summary: string | null,
    recentMessages: { role: string; content: string }[],
    ragContext: string,
    currentQuery: string,
    toolOutputs: any[] = [],
    visitorInfo?: { name: string; email: string },
    options?: { channel?: 'text' | 'voice' }
  ): { role: 'system' | 'user' | 'assistant'; content: string }[] {
    const template = options?.channel === 'voice' ? RAG_VOICE_SYSTEM_PROMPT : RAG_SYSTEM_PROMPT;
    let systemContent = template
      .replace('{identity}', RAG_IDENTITY_FACTS)
      .replace('{catalog}', getCompactServiceCatalog())
      .replace('{context}', ragContext || 'No additional source excerpts were retrieved.');

    if (visitorInfo) {
      const firstName = visitorInfo.name.split(/\s+/)[0] || visitorInfo.name;
      if (options?.channel === 'voice') {
        systemContent += `\n\nVisitor on this call: ${visitorInfo.name} <${visitorInfo.email}>. Address them as ${firstName}. They are a client or recruiter talking to RAGX. They are not Musharraf Aziz unless that is literally their name. Do not ask for name or email again.`;
      } else {
        systemContent += `\n\nVisitor: ${visitorInfo.name} <${visitorInfo.email}>. Do not ask for name or email again.`;
      }
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
