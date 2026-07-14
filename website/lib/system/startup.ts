import { checkHealth } from './health';
import { checkReadiness } from './readiness';
import { getSystemVersion } from './version';
import { telemetryLogger } from '../telemetry';

import { providerRegistry } from '../providers/registry';
import { GroqChatProvider } from '../providers/chat/groq';
import { DefaultChatProvider } from '../providers/chat/default';
import { JinaEmbeddingProvider } from '../providers/embedding/jina';
import { JinaRerankerProvider } from '../providers/reranker/jina';

import { agentRegistry } from '../agents/registry';
import { RAGAgent } from '../agents/implementations/rag-agent';

import { toolRegistry } from '../tools/registry';
import { HealthTool, TimeTool, EchoTool } from '../tools/instances';

function bootstrapRegistries() {
  telemetryLogger.log('SYSTEM', 'Bootstrapping registries...');
  
  providerRegistry.registerProvider('groq', new GroqChatProvider());
  providerRegistry.registerProvider('default', new DefaultChatProvider());
  providerRegistry.registerProvider('jina_embedding', new JinaEmbeddingProvider());
  providerRegistry.registerProvider('jina_reranker', new JinaRerankerProvider());

  agentRegistry.register(new RAGAgent());

  toolRegistry.register(HealthTool);
  toolRegistry.register(TimeTool);
  toolRegistry.register(EchoTool);
}

export function validateStartup() {
  telemetryLogger.log('SYSTEM', 'Initiating startup sequence');

  // 1. Bootstrap all plugins/providers centrally
  bootstrapRegistries();

  // 2. Validate internal health
  const health = checkHealth();
  if (health.status !== 'pass') {
    throw new Error(`Startup failed: Health check did not pass. Details: ${JSON.stringify(health.checks)}`);
  }

  // 3. Validate external readiness (dependencies)
  const readiness = checkReadiness();
  if (readiness.status !== 'ready') {
    throw new Error(`Startup failed: Readiness check did not pass. Details: ${JSON.stringify(readiness.dependencies)}`);
  }

  // 4. Print Deterministic Startup Banner
  const versionInfo = getSystemVersion();
  const providers = providerRegistry.listProviders().join(', ');
  const agents = agentRegistry.list().join(', ');
  const tools = toolRegistry.listDefinitions().map(t => t.name).join(', ');

  console.log('==========================================');
  console.log(`APPLICATION STARTUP`);
  console.log('==========================================');
  console.log(`Version:     ${versionInfo.version}`);
  console.log(`Commit:      ${versionInfo.commit}`);
  console.log(`Environment: ${versionInfo.environment}`);
  console.log(`Providers:   ${providers}`);
  console.log(`Agents:      ${agents}`);
  console.log(`Tools:       ${tools}`);
  console.log('==========================================');

  telemetryLogger.log('SYSTEM', 'Startup validation completed successfully');
}
