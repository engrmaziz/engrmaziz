/* eslint-disable @typescript-eslint/no-explicit-any */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: any;
}

export class RAGLogger {
  private moduleName: string;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    let logMsg = `[${timestamp}] [${level.toUpperCase()}] [RAG:${this.moduleName}] ${message}`;
    if (context && Object.keys(context).length > 0) {
      logMsg += ` | Context: ${JSON.stringify(context)}`;
    }
    return logMsg;
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: any, context?: LogContext) {
    const errCtx = error ? { ...context, error: error.message || error } : context;
    console.error(this.formatMessage('error', message, errCtx));
  }
}

export const createLogger = (moduleName: string) => new RAGLogger(moduleName);
