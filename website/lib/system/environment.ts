import { systemConfigSchema, SystemConfigType } from './validator';

export function loadEnvironment(): Readonly<SystemConfigType> {
  const result = systemConfigSchema.safeParse(process.env);
  
  if (!result.success) {
    throw new Error(`System Configuration Error: ${result.error.message}`);
  }

  return Object.freeze(result.data);
}
