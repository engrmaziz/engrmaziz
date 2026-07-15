import { systemConfig } from './config';

export function getSystemVersion() {
  return {
    version: '1.2.0', // Application version
    commit: systemConfig.GIT_COMMIT,
    timestamp: systemConfig.BUILD_TIMESTAMP,
    environment: systemConfig.NODE_ENV
  };
}
