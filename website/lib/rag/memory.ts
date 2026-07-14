import { ragDatabase } from './supabase';

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

  async saveUserMessage(conversationId: string, content: string) {
    return await ragDatabase.insertMessage(conversationId, 'user', content);
  }

  async saveAssistantMessage(conversationId: string, content: string, citations?: any, model?: string, latency?: number) {
    return await ragDatabase.insertMessage(conversationId, 'assistant', content, citations, model, latency);
  }
}

export const ragMemory = new ConversationMemoryService();

export class ConversationSummaryService {
  async summarizeConversation(conversationId: string): Promise<string> {
    if (process.env.ENABLE_CONVERSATION_SUMMARY !== 'true') {
      throw new Error("NotImplementedError: Conversation summary is disabled by feature flag.");
    }
    throw new Error("NotImplementedError: Phase 2 implementation.");
  }
}

export const ragSummary = new ConversationSummaryService();
