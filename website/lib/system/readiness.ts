import { systemConfig } from './config';

export function checkReadiness() {
  const isDatabaseConfigured = !!systemConfig.NEXT_PUBLIC_SUPABASE_URL && !!systemConfig.SUPABASE_DB_PASSWORD;
  
  // Note: Readiness does NOT perform a live HTTP ping. It strictly validates 
  // dependency availability structurally.
  
  const isReady = isDatabaseConfigured;

  return {
    status: isReady ? 'ready' : 'not_ready',
    dependencies: {
      database: isDatabaseConfigured ? 'available' : 'unavailable'
    }
  };
}
