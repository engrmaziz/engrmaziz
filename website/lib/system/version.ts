import { systemConfig } from './config';

export function getSystemVersion() {
  return {
    version: '1.2.0', // Application version
    commit: process.env.GIT_COMMIT || 'unknown',
    timestamp: process.env.BUILD_TIMESTAMP || new Date().toISOString(),
    environment: systemConfig.NODE_ENV
  };
}
