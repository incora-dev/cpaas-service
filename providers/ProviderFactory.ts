import { BaseProvider } from './BaseProvider';
import { InfobipProvider, InfobipConfig } from './InfobipProvider';

export type ProviderType = 'infobip';

export interface ProviderConfig {
  infobip?: InfobipConfig;
}

export class ProviderFactory {
  private static providers = new Map<string, BaseProvider>();

  static createProvider(type: ProviderType, config?: ProviderConfig): BaseProvider {
    if (this.providers.has(type)) {
      return this.providers.get(type)!;
    }

    let provider: BaseProvider;
    switch (type) {
      case 'infobip':
        if (!config?.infobip) {
          throw new Error('Infobip provider requires configuration');
        }
        provider = new InfobipProvider(config.infobip);
        break;
      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }

    this.providers.set(type, provider);
    return provider;
  }

  static getProvider(type: ProviderType): BaseProvider | undefined {
    return this.providers.get(type);
  }

  static getAllProviders(): BaseProvider[] {
    return Array.from(this.providers.values());
  }

  static clearProviders(): void {
    this.providers.clear();
  }
}
