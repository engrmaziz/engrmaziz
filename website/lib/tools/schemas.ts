/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export function validateSchema(args: Record<string, unknown>, schema: Record<string, any>): string[] {
  const errors: string[] = [];
  const required = schema.required || [];
  
  for (const req of required) {
    if (args[req] === undefined || args[req] === null) {
      errors.push(`Missing required parameter: ${req}`);
    }
  }

  const properties = schema.properties || {};
  for (const [key, val] of Object.entries(args)) {
    if (!properties[key]) continue;
    
    const expectedType = properties[key].type;
    const actualType = typeof val;
    if (expectedType && expectedType !== 'any' && actualType !== expectedType) {
      errors.push(`Parameter '${key}' expected type '${expectedType}' but received '${actualType}'`);
    }
  }

  return errors;
}
