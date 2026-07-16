/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
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
    // Attempt to insert the conversation. If it exists, do nothing (onConflict: 'id').
    const payload: any = { id, status: 'active' };
    if (visitorInfo) {
      payload.visitor_name = visitorInfo.name;
      payload.visitor_email = visitorInfo.email;
    }
    
    try {
      await db.insert('conversations', payload);
    } catch (err: any) {
      // If it's a unique constraint violation (code 23505), it already exists, which is fine.
      if (err.code !== '23505') {
        throw err;
      }
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
