import { ragDatabase } from './supabase';
import { telemetryLogger } from '../telemetry';

export class ConversationMemoryService {
  async loadConversation(conversationId: string) {
    return await ragDatabase.getConversation(conversationId);
  }

  async createConversation(conversationId?: string) {
    return await ragDatabase.createConversation(conversationId);
  }

  async loadRecentMessages(conversationId: string, limit: number = 10) {
    return await ragDatabase.getRecentMessages(conversationId, limit);
  }

  async loadUnsummarizedMessages(conversationId: string, offset: number) {
    return await ragDatabase.getUnsummarizedMessages(conversationId, offset);
  }

  async saveUserMessage(conversationId: string, content: string) {
    return await ragDatabase.insertMessage(conversationId, 'user', content);
  }

  async saveAssistantMessage(conversationId: string, content: string, citations?: any, model?: string, latency?: number) {
    return await ragDatabase.insertMessage(conversationId, 'assistant', content, citations, model, latency);
  }
}

export const ragMemory = new ConversationMemoryService();

export class ConversationSummaryService {
  private summaryPrompt = `Summarize the conversation.

Preserve exactly:
- goals
- project requirements
- architectural decisions
- constraints
- assumptions
- unresolved issues
- TODO items

Exclude:
- greetings
- repetition
- filler
- acknowledgements

Write factual statements only.
Do not invent information.`;

  async triggerAsyncSummarization(conversationId: string) {
    const MAX_RECENT_MESSAGES = 20;
    
    try {
      const conv = await ragDatabase.getConversation(conversationId);
      if (!conv) return;

      const summarizedCount = conv.summary_message_count || 0;
      const unsummarizedMessages = await ragDatabase.getUnsummarizedMessages(conversationId, summarizedCount);
      
      if (unsummarizedMessages.length <= MAX_RECENT_MESSAGES) {
        return; // Safe, under threshold
      }

      // Execute Threshold Summarization (Outside of the critical path!)
      const { createAIClient } = await import('../ai/client');
      const aiClient = createAIClient();
      
      let payload = `--- CURRENT SUMMARY ---\n${conv.summary || 'None'}\n\n--- NEW MESSAGES TO ARCHIVE ---\n`;
      for (const msg of unsummarizedMessages) {
        payload += `[${msg.role}]: ${msg.content}\n`;
      }

      const messages = [
        { role: 'system', content: this.summaryPrompt },
        { role: 'user', content: payload }
      ];

      const res = await aiClient.generateComplexResponse(messages as any);
      const newSummary = res.content;
      
      const newCount = summarizedCount + unsummarizedMessages.length;
      await ragDatabase.updateConversationSummary(conversationId, newSummary, newCount);
      telemetryLogger.log('SUMMARY', `Compacted ${unsummarizedMessages.length} messages. Total offset now: ${newCount}`);

    } catch (e) {
      telemetryLogger.error('SUMMARY', 'Async summarization failed', e);
    }
  }
}

export const ragSummary = new ConversationSummaryService();
