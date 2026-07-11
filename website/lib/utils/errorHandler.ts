/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { logger } from './logger';
import { AppError } from './errors';

export function withErrorHandler(handler: (...args: any[]) => any) {
  return async (...args: unknown[]) => {
    try {
      return await handler(...args);
    } catch (error: any) {
      // 1. Generate Correlation ID for tracing
      const correlationId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 2. Structured Logging
      logger.error(`API Error: ${error.message}`, {
        correlationId,
        stack: error.stack,
        name: error.name,
        code: error.code || 'UNKNOWN'
      });

      // 3. Graceful Fallback
      if (error instanceof AppError) {
        return NextResponse.json({
          success: false,
          error: error.message,
          code: error.name,
          correlationId
        }, { status: error.statusCode });
      }

      // Hide internal server errors from client
      return NextResponse.json({
        success: false,
        error: 'An internal server error occurred.',
        code: 'INTERNAL_SERVER_ERROR',
        correlationId
      }, { status: 500 });
    }
  };
}
