/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { db } from '@/lib/db/supabase';
import { Database } from '@/lib/types/database';

type ContactInsert = Database['public']['Tables']['contacts']['Insert'];

export class ContactService {
  async createContact(data: ContactInsert) {
    return db.insert('contacts', data);
  }

  async updateLeadScore(id: string, score: number) {
    return db.select('contacts', { id, lead_score: score });
  }
}

export class ConversationService {
  async startConversation(visitorId: string) {
    return db.insert('conversations', { visitor_id: visitorId, status: 'active', lead_score: 0 });
  }

  async ensureConversationExists(id: string, visitorInfo?: any) {
    const payload: any = { id, status: 'active' };
    if (visitorInfo) {
      payload.visitor_name = visitorInfo.name;
      payload.visitor_email = String(visitorInfo.email || "").trim().toLowerCase();
    }
    
    try {
      await db.insert('conversations', payload);
    } catch (err: any) {
      if (err.code !== '23505') {
        throw err;
      }
    }
  }

  async assertExistingConversationOwner(id: string, visitorInfo: { name: string; email: string }) {
    const { ragDatabase } = await import("@/lib/rag/supabase");
    const email = String(visitorInfo.email || "").trim().toLowerCase();
    const conv = await ragDatabase.getConversation(id);
    if (!conv) {
      const { AppError } = await import("@/lib/utils/errors");
      throw new AppError("Session does not match this visitor.", 403, "FORBIDDEN");
    }
    const bound = String(conv.visitor_email || "").trim().toLowerCase();
    if (!bound || bound !== email) {
      const { AppError } = await import("@/lib/utils/errors");
      throw new AppError("Session does not match this visitor.", 403, "FORBIDDEN");
    }
  }

  async assertVisitorOwnsConversation(id: string, visitorInfo: { name: string; email: string }) {
    const { ragDatabase } = await import("@/lib/rag/supabase");
    const email = String(visitorInfo.email || "").trim().toLowerCase();
    const name = String(visitorInfo.name || "").trim().slice(0, 80);
    const conv = await ragDatabase.getConversation(id);
    if (!conv) {
      await this.ensureConversationExists(id, { name, email });
      return;
    }
    const bound = String(conv.visitor_email || "").trim().toLowerCase();
    if (bound && bound !== email) {
      const { AppError } = await import("@/lib/utils/errors");
      throw new AppError("Session does not match this visitor.", 403, "FORBIDDEN");
    }
    if (!bound && email) {
      await ragDatabase.bindConversationVisitor(id, name, email);
    }
  }

  async saveMessage(conversationId: string, role: string, content: string, citations?: any) {
    // Notice: To use upsert via the 'db' stub we would need to add an upsert method,
    // but we can just use supabase client directly if we export it, or handle it in RAGXService.
    const { supabase } = require('@/lib/db/supabase');
    return supabase.from('messages').insert({ conversation_id: conversationId, role, content, citations });
  }
}

export class DocumentService {
  async logDocumentUpload(title: string, mimeType: string, path: string) {
    return db.insert('documents', { title, document_type: 'pdf', file_path: path });
  }
}

export class SearchService {
  async hybridSearch(query: string, limit: number) {
    // In production: Supabase RPC call to 'match_documents'
    return db.select('embeddings', { limit });
  }
}

// Export singleton instances to prevent memory leaks and ensure connection pooling stability
export const contactService = new ContactService();
export const conversationService = new ConversationService();
export const documentService = new DocumentService();
export const searchService = new SearchService();
