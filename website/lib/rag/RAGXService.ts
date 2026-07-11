/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { promptManager } from './PromptManager';
import { hybridSearch } from './HybridSearch';
import { aiChat } from '@/lib/ai/chat';
import { conversationService } from '@/lib/db/services';
import { leadScoring } from '@/lib/services/LeadScoringService';
import { emailService } from '@/lib/email/resend';

export class RAGXService {
  /**
   * Intelligently routes the query to the correct OSS model class
   */
  private determineRoutingModel(query: string): 'simple' | 'complex' {
    const complexKeywords = ['architecture', 'backend', 'rag', 'infrastructure', 'interview', 'scale'];
    const isComplex = complexKeywords.some(kw => query.toLowerCase().includes(kw));
    return isComplex ? 'complex' : 'simple';
  }

  async processMessage(conversationId: string, message: string, visitorInfo?: any) {
    // 1. Guardrails
    const isSafe = await promptManager.validatePromptSecurity(message);
    if (!isSafe) {
      throw new Error("Security policy violation: Prompt rejected.");
    }

    // 2. Retrieval
    const retrieval = await hybridSearch.retrieveContext(message);

    // 3. Prompt Assembly
    const systemPrompt = await promptManager.getSystemPrompt();
    const assembledMessages = [
      { role: 'system' as const, content: `${systemPrompt}\n\nContext:\n${retrieval.contextText}` },
      { role: 'user' as const, content: message }
    ];

    // 4. Model Routing & Generation
    const route = this.determineRoutingModel(message);
    let llmResponse;
    if (route === 'complex') {
      llmResponse = await aiChat.chatComplex(assembledMessages);
    } else {
      llmResponse = await aiChat.chatSimple(message);
    }

    // 5. Conversation Persistence
    await conversationService.saveMessage(conversationId, 'user', message);
    await conversationService.saveMessage(conversationId, 'assistant', llmResponse.content, retrieval.citations);

    // 6. Lead Qualification Hook (Async)
    this.processQualification(conversationId, message, visitorInfo).catch(console.error);

    return {
      content: llmResponse.content,
      citations: retrieval.citations,
      modelUsed: llmResponse.model,
      tokenUsage: llmResponse.usage
    };
  }

  private async processQualification(conversationId: string, message: string, visitorInfo: any) {
    // If intent matches "hiring" or "booking", calculate score and alert admin
    if (message.toLowerCase().includes('hire') || message.toLowerCase().includes('meet')) {
       const score = leadScoring.calculateScore({ email: visitorInfo?.email || '', projectDescription: message });
       if (score > 50) {
         await emailService.sendContactNotification({ ...visitorInfo, message, projectType: 'RAGX Lead' });
       }
    }
  }
}

export const ragxService = new RAGXService();
