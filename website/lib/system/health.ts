import { systemConfig } from './config';
import { providerRegistry } from '../providers/registry';
import { agentRegistry } from '../agents/registry';
import { toolRegistry } from '../tools/registry';

export function checkHealth() {
  const isConfigLoaded = !!systemConfig;
  const isProvidersInitialized = providerRegistry.listProviders().length > 0;
  const isAgentsInitialized = agentRegistry.list().length > 0;
  const isToolsInitialized = toolRegistry.listDefinitions().length > 0;

  const isHealthy = isConfigLoaded && isProvidersInitialized && isAgentsInitialized && isToolsInitialized;

  return {
    status: isHealthy ? 'pass' : 'fail',
    checks: {
      config: isConfigLoaded ? 'pass' : 'fail',
      providers: isProvidersInitialized ? 'pass' : 'fail',
      agents: isAgentsInitialized ? 'pass' : 'fail',
      tools: isToolsInitialized ? 'pass' : 'fail'
    }
  };
}
