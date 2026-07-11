/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types/api';
import { AppError } from '@/lib/utils/errors';
import { logger } from '@/lib/utils/logger';

export function successResponse<T>(data: T, meta?: Record<string, any>, status = 200) {
  const payload: ApiResponse<T> = { success: true, data };
  if (meta !== undefined) {
    payload.meta = meta;
  }
  return NextResponse.json(payload, { status });
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error('Operational Error', { code: error.code, message: error.message });
    }
    
    const payload: ApiResponse<null> = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: (error as any).details,
      }
    };
    return NextResponse.json(payload, { status: error.statusCode });
  }

  // Unhandled internal error
  logger.error('Unhandled Exception', { error });
  
  const payload: ApiResponse<null> = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    }
  };
  
  return NextResponse.json(payload, { status: 500 });
}
