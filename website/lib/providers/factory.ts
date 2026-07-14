import { ChatProvider, EmbeddingProvider, RerankerProvider } from './types';
import { providerRegistry } from './registry';
import { ProviderConfigurationError } from './errors';

// Initialize the registry
import { GroqChatProvider } from './chat/groq';
import { DefaultChatProvider } from './chat/default';
import { JinaEmbeddingProvider } from './embedding/jina';
import { JinaRerankerProvider } from './reranker/jina';

// Register available providers
providerRegistry.registerProvider('groq', new GroqChatProvider());
providerRegistry.registerProvider('default', new DefaultChatProvider());
providerRegistry.registerProvider('jina_embedding', new JinaEmbeddingProvider());
providerRegistry.registerProvider('jina_reranker', new JinaRerankerProvider());

export class ProviderFactory {
  getChatProvider(): ChatProvider {
    const providerId = process.env.CHAT_PROVIDER || 'default';
    try {
      return providerRegistry.getProvider<ChatProvider>(providerId);
    } catch (e) {
      throw new ProviderConfigurationError(`Configured CHAT_PROVIDER '${providerId}' could not be resolved.`);
    }
  }

  getEmbeddingProvider(): EmbeddingProvider {
    const providerId = process.env.EMBEDDING_PROVIDER || 'jina_embedding';
    try {
      return providerRegistry.getProvider<EmbeddingProvider>(providerId);
    } catch (e) {
      throw new ProviderConfigurationError(`Configured EMBEDDING_PROVIDER '${providerId}' could not be resolved.`);
    }
  }

  getRerankerProvider(): RerankerProvider {
    const providerId = process.env.RERANKER_PROVIDER || 'jina_reranker';
    try {
      return providerRegistry.getProvider<RerankerProvider>(providerId);
    } catch (e) {
      throw new ProviderConfigurationError(`Configured RERANKER_PROVIDER '${providerId}' could not be resolved.`);
    }
  }
}

export const providerFactory = new ProviderFactory();
