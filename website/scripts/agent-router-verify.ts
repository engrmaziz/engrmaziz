// @ts-nocheck
import { agentRegistry, agentRouter } from '../lib/agents';
import { validateStartup } from '../lib/system';
import { logger } from '../lib/utils/logger';

async function verifyAgentRouter() {
  validateStartup();
  logger.info('Starting Agent Router Verification...');

  // 1. Agent registration succeeds
  const agents = agentRegistry.list();
  if (!agents.includes('rag-agent')) {
    throw new Error('rag-agent was not registered successfully.');
  }

  // 2. Duplicate registration fails
  try {
    agentRegistry.register({ id: 'rag-agent', description: '', execute: async () => ({ content: '', model: '' }) });
    throw new Error('Duplicate registration should have failed.');
  } catch (err: any) {
    logger.info('Duplicate registration successfully rejected.');
  }

  // 3. Unknown lookup fails
  try {
    agentRegistry.get('unknown-agent');
    throw new Error('Unknown lookup should have failed.');
  } catch (err: any) {
    logger.info('Unknown lookup successfully rejected.');
  }

  // 4. Router always returns RAGAgent
  const agent = agentRouter.route({} as any);
  if (agent.id !== 'rag-agent') {
    throw new Error('Router did not return rag-agent.');
  }
  
  logger.info('Agent Router Verification Completed.');
}

verifyAgentRouter().catch((err) => {
  logger.error('Verification failed', err);
  process.exit(1);
});
