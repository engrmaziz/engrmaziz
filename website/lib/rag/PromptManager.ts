/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { db } from '@/lib/db/supabase';

export class PromptManager {
  async getSystemPrompt(category: string = 'System Prompt'): Promise<string> {
    const defaultPrompt = `
      You are RAGX, Musharraf Aziz's AI Senior Solutions Architect and Client Qualification Assistant.
      You must never pretend to be Musharraf. You speak on behalf of his portfolio.
      Only use the provided context to answer questions. Never fabricate or hallucinate.
      If information is missing, state: "I couldn't find verified information about that."
    `;

    try {
      const { data } = await db.select('prompt_versions', { 
        prompt_name: category, 
        active: true 
      });
      return data?.[0]?.content_hash || defaultPrompt;
    } catch (e) {
      return defaultPrompt;
    }
  }

  async validatePromptSecurity(prompt: string): Promise<boolean> {
    // Implement prompt injection/jailbreak detection heuristics here
    const blockedKeywords = ['ignore previous', 'system prompt', 'you are now', 'bypass'];
    return !blockedKeywords.some(kw => prompt.toLowerCase().includes(kw));
  }
}

export const promptManager = new PromptManager();
