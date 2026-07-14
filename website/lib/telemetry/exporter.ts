import { RequestTraceData } from './types';
import { redactSensitiveData } from './redaction';

function deepClone<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

function stableSortKeys(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => stableSortKeys(item));
  }
  
  if (typeof obj === 'object') {
    const sortedObj: Record<string, any> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sortedObj[key] = stableSortKeys(obj[key]);
    }
    return sortedObj;
  }
  
  return obj;
}

export function exportTrace(trace: RequestTraceData, pretty = false): string {
  // 1. Deep clone
  const cloned = deepClone(trace);
  
  // 2. Redact
  const redacted = redactSensitiveData(cloned);
  
  // 3. Stable key ordering
  const ordered = stableSortKeys(redacted);
  
  // 4. Deterministic JSON serialization
  return JSON.stringify(ordered, null, pretty ? 2 : undefined);
}
