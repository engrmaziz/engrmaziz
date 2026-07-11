/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  projectType: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  consent: z.boolean().refine(val => val === true, "Consent is required"),
});

export const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string()
  })).max(50),
  context: z.record(z.any()).optional()
});

export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  limit: z.number().min(1).max(50).default(10),
  filters: z.record(z.any()).optional()
});
