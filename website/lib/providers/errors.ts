export class ProviderNotRegisteredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderNotRegisteredError';
  }
}

export class ProviderConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderConfigurationError';
  }
}

export class ProviderExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderExecutionError';
  }
}
