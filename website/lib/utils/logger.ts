/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import { systemConfig } from '../system';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown> | undefined;
  timestamp: string;
}

class Logger {
  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    // In production, this could format to JSON for structured logging aggregation.
    if (systemConfig.NODE_ENV === 'production') {
      console.log(JSON.stringify(entry));
    } else {
      const color = level === LogLevel.ERROR ? '\x1b[31m' : level === LogLevel.WARN ? '\x1b[33m' : '\x1b[36m';
      console.log(`${color}[${entry.timestamp}] ${level}\x1b[0m: ${message}`, context ? context : '');
    }
  }

  info(message: string, context?: Record<string, unknown>) { this.log(LogLevel.INFO, message, context); }
  warn(message: string, context?: Record<string, unknown>) { this.log(LogLevel.WARN, message, context); }
  error(message: string, context?: Record<string, unknown>) { this.log(LogLevel.ERROR, message, context); }
  debug(message: string, context?: Record<string, unknown>) { 
    if (systemConfig.NODE_ENV !== 'production') this.log(LogLevel.DEBUG, message, context); 
  }
}

export const logger = new Logger();
