import { getSystemVersion } from './version';

const startupTimestamp = new Date().toISOString();

export function getRuntimeMetadata() {
  const versionInfo = getSystemVersion();
  
  return {
    startupTime: startupTimestamp,
    uptime: process.uptime(),
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    environment: versionInfo.environment,
    applicationVersion: versionInfo.version,
    gitCommit: versionInfo.commit
  };
}
