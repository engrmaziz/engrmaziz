import { getSystemVersion } from './version';
import { getRuntimeMetadata } from './runtime';
import { providerRegistry } from '../providers/registry';
import { agentRegistry } from '../agents/registry';
import { toolRegistry } from '../tools/registry';
import { checkHealth } from './health';
import { checkReadiness } from './readiness';

export function getDiagnostics() {
  return {
    registeredProviders: providerRegistry.listProviders(),
    registeredAgents: agentRegistry.list(),
    registeredTools: toolRegistry.listDefinitions().map(t => t.name),
    version: getSystemVersion(),
    startupTimestamp: getRuntimeMetadata().startupTime,
    environment: getRuntimeMetadata().environment,
    readinessState: checkReadiness().status,
    healthState: checkHealth().status
  };
}
