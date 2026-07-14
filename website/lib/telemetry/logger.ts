import { LoggerNamespace } from './types';

export class StructuredLogger {
  log(namespace: LoggerNamespace, message: string, params?: Record<string, any>) {
    let output = `[${namespace}] ${message}`;
    if (params) {
      const formattedParams = Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${v}`)
        .join(' ');
      if (formattedParams) {
        output += ` ${formattedParams}`;
      }
    }
    console.log(output);
  }

  error(namespace: LoggerNamespace, message: string, error?: any, params?: Record<string, any>) {
    let output = `[${namespace}] ERROR: ${message}`;
    if (params) {
      const formattedParams = Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${v}`)
        .join(' ');
      if (formattedParams) {
        output += ` ${formattedParams}`;
      }
    }
    if (error) {
      output += ` | ${error instanceof Error ? error.message : String(error)}`;
    }
    console.error(output);
  }
}

export const telemetryLogger = new StructuredLogger();
