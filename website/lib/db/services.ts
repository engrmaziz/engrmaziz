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

  async saveMessage(conversationId: string, role: string, content: string, citations?: any) {
    return db.insert('messages', { conversation_id: conversationId, role, content, citations });
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
