import { ChatProvider, EmbeddingProvider, RerankerProvider } from './types';
import { ProviderNotRegisteredError, ProviderConfigurationError } from './errors';

type AnyProvider = ChatProvider | EmbeddingProvider | RerankerProvider;

export class ProviderRegistry {
  private providers: Map<string, AnyProvider> = new Map();

  registerProvider(id: string, provider: AnyProvider): void {
    if (this.providers.has(id)) {
      throw new ProviderConfigurationError(`Provider with ID '${id}' is already registered.`);
    }
    this.providers.set(id, provider);
  }

  getProvider<T extends AnyProvider>(id: string): T {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new ProviderNotRegisteredError(`Provider '${id}' is not registered.`);
    }
    return provider as T;
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const providerRegistry = new ProviderRegistry();
