/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { ChatProvider, EmbeddingProvider, RerankerProvider } from './types';
import { providerRegistry } from './registry';
import { ProviderConfigurationError } from './errors';
import { systemConfig } from '../system/config';

// Removed automatic registration. Handled by system/startup.ts

export class ProviderFactory {
  getChatProvider(): ChatProvider {
    const providerId = systemConfig.CHAT_PROVIDER;
    try {
      return providerRegistry.getProvider<ChatProvider>(providerId);
    } catch (e) {
      throw new ProviderConfigurationError(`Configured CHAT_PROVIDER '${providerId}' could not be resolved.`);
    }
  }

  getEmbeddingProvider(): EmbeddingProvider {
    const providerId = systemConfig.EMBEDDING_PROVIDER;
    try {
      return providerRegistry.getProvider<EmbeddingProvider>(providerId);
    } catch (e) {
      throw new ProviderConfigurationError(`Configured EMBEDDING_PROVIDER '${providerId}' could not be resolved.`);
    }
  }

  getRerankerProvider(): RerankerProvider {
    const providerId = systemConfig.RERANKER_PROVIDER;
    try {
      return providerRegistry.getProvider<RerankerProvider>(providerId);
    } catch (e) {
      throw new ProviderConfigurationError(`Configured RERANKER_PROVIDER '${providerId}' could not be resolved.`);
    }
  }
}

export const providerFactory = new ProviderFactory();
