// @ts-nocheck
import { providerRegistry, providerFactory, ProviderNotRegisteredError, ProviderConfigurationError } from '../lib/providers';
import { validateStartup } from '../lib/system';
import { logger } from '../lib/utils/logger';

async function verifyProviders() {
  validateStartup();
  logger.info('Starting Provider Abstraction Layer Verification...');

  // 1. Verify registry contents
  const providers = providerRegistry.listProviders();
  logger.info(`Registered providers: ${providers.join(', ')}`);
  
  if (!providers.includes('groq') || !providers.includes('default') || !providers.includes('jina_embedding') || !providers.includes('jina_reranker')) {
    throw new Error('Missing expected providers in registry.');
  }

  // 2. Verify duplicate registration fails
  try {
    providerRegistry.registerProvider('groq', null as any);
    throw new Error('Registry allowed duplicate registration!');
  } catch (err: any) {
    if (!(err instanceof ProviderConfigurationError)) {
      throw new Error(`Expected ProviderConfigurationError for duplicate registration, got: ${err.constructor.name}`);
    }
    logger.info('Duplicate registration successfully rejected.');
  }

  // 3. Verify unknown provider fails
  try {
    providerRegistry.getProvider('does_not_exist');
    throw new Error('Registry allowed unknown provider lookup!');
  } catch (err: any) {
    if (!(err instanceof ProviderNotRegisteredError)) {
      throw new Error(`Expected ProviderNotRegisteredError for unknown lookup, got: ${err.constructor.name}`);
    }
    logger.info('Unknown provider lookup successfully rejected.');
  }

  // 4. Verify Factory returns expected implementations
  const chat = providerFactory.getChatProvider();
  const embed = providerFactory.getEmbeddingProvider();
  const rerank = providerFactory.getRerankerProvider();

  logger.info(`Factory resolved ChatProvider: ${chat.name}`);
  logger.info(`Factory resolved EmbeddingProvider: ${embed.name}`);
  logger.info(`Factory resolved RerankerProvider: ${rerank.name}`);

  if (!chat.name || !embed.name || !rerank.name) {
    throw new Error('Factory returned invalid provider implementations.');
  }

  logger.info('Provider Abstraction Layer verification completed successfully!');
}

verifyProviders().catch((err) => {
  logger.error('Verification failed', err);
  process.exit(1);
});
