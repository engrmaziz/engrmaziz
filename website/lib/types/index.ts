/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  role?: string;
  projectType?: string;
  timeline?: string;
  message: string;
  consent: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  createdAt: string;
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  score: number;
}

export interface EmbeddingDocument {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
