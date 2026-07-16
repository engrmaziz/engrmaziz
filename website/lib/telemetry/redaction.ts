/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
const SENSITIVE_KEYS = new Set([
  'authorization',
  'api_key',
  'apikey',
  'token',
  'password',
  'cookie',
  'secret',
  'credentials',
  'bearer',
  'access_token',
  'refresh_token'
]);

export function redactSensitiveData(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactSensitiveData(item));
  }

  if (typeof obj === 'object') {
    const redactedObj: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const lowerKey = key.toLowerCase();
      let isSensitive = false;
      
      for (const sensitiveKey of SENSITIVE_KEYS) {
        if (lowerKey.includes(sensitiveKey)) {
          isSensitive = true;
          break;
        }
      }

      if (isSensitive && typeof obj[key] === 'string') {
        redactedObj[key] = '***REDACTED***';
      } else {
        redactedObj[key] = redactSensitiveData(obj[key]);
      }
    }
    return redactedObj;
  }

  return obj;
}
