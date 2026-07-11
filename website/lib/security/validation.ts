/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { z } from 'zod';
import { ValidationError } from '@/lib/utils/errors';

export async function validateRequest<T>(schema: z.ZodType<T>, req: Request): Promise<T> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      throw new ValidationError('Invalid request payload', result.error.flatten());
    }
    
    return result.data;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError('Malformed JSON payload');
  }
}

export function validateParams<T>(schema: z.ZodType<T>, params: unknown): T {
  const result = schema.safeParse(params);
  if (!result.success) {
    throw new ValidationError('Invalid request parameters', result.error.flatten());
  }
  return result.data;
}
