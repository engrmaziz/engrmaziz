/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { z } from 'zod';
import { ValidationError } from '@/lib/utils/errors';

export async function validateRequest<T>(schema: z.ZodType<T>, req: Request): Promise<T> {
  let body;
  try {
    body = await req.json();
  } catch (e: any) {
    throw new ValidationError(`Failed to parse JSON body: ${e.message}`);
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    console.error('[Validation] Schema parsing failed:', JSON.stringify(result.error.flatten(), null, 2));
    console.error('[Validation] Received body:', JSON.stringify(body, null, 2));
    throw new ValidationError('Invalid request payload', result.error.flatten());
  }
  
  return result.data;
}

export function validateParams<T>(schema: z.ZodType<T>, params: unknown): T {
  const result = schema.safeParse(params);
  if (!result.success) {
    throw new ValidationError('Invalid request parameters', result.error.flatten());
  }
  return result.data;
}
