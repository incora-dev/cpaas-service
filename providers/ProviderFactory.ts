import { BaseProvider } from './BaseProvider';
import { InfobipProvider, InfobipConfig } from './InfobipProvider';
import { DynamoDBConfigService } from '../services/DynamoDBConfigService';
import { MarketPreferenceService } from '../services/MarketPreferenceService';
import { 
  MarketContext, 
  ChannelSelectionResult 
} from '../types/dynamodb-config.types';

export type ProviderType = 'infobip' | 'test-provider';

export interface ProviderConfig {
  infobip?: InfobipConfig;
}

export type ProviderSelectionStrategy = 'first-available' | 'random' | 'round-robin' | 'cost-optimized';

export interface ProviderFactoryOptions {
  dynamoDBConfigService: DynamoDBConfigService;
  marketPreferenceService?: MarketPreferenceService;
  providerSelectionStrategy?: ProviderSelectionStrategy;
  providerConfigs?: Record<string, any>;
}

export class ProviderFactory {
  private static providers = new Map<string, BaseProvider>();
  private static dynamoDBConfigService: DynamoDBConfigService;
  private static marketPreferenceService: MarketPreferenceService;
  private static providerSelectionStrategy: ProviderSelectionStrategy = 'first-available';
  private static providerConfigs: Record<string, any> = {};

  static initialize(options: ProviderFactoryOptions) {
    this.dynamoDBConfigService = options.dynamoDBConfigService;
    this.marketPreferenceService = options.marketPreferenceService || new MarketPreferenceService();
    this.providerSelectionStrategy = options.providerSelectionStrategy || 'first-available';
    this.providerConfigs = options.providerConfigs || {};
  }

  static async selectChannel(
    marketContext: MarketContext,
    messageType?: string
  ): Promise<ChannelSelectionResult> {
    if (!this.marketPreferenceService) {
      throw new Error('ProviderFactory not initialized. Call initialize() first.');
    }

    const channels = await this.dynamoDBConfigService.getChannelsForMarketContext(marketContext);
    return this.marketPreferenceService.selectChannel(channels, marketContext, messageType);
  }

  private static async getProviderForChannel(
    marketContext: MarketContext,
    channel: string
  ): Promise<BaseProvider> {
    const availableProviders = await this.getAvailableProvidersForChannel(channel);
    
    if (availableProviders.length === 0) {
      throw new Error(`No providers available for channel: ${channel}`);
    }

    switch (this.providerSelectionStrategy) {
      case 'first-available':
        return availableProviders[0]!;

      case 'random':
        const randomIndex = Math.floor(Math.random() * availableProviders.length);
        return availableProviders[randomIndex]!;

      case 'cost-optimized':
        // For now, just return the first available provider
        // In a real implementation need to compare costs
        console.log('Cost optimized selection', marketContext);
        return availableProviders[0]!;

      default:
        return availableProviders[0]!;
    }
  }

  private static async getAvailableProvidersForChannel(channel: string): Promise<BaseProvider[]> {
    const providers: BaseProvider[] = [];

    for (const [_, provider] of this.providers) {
      if (provider.supportsChannel(channel)) {
        providers.push(provider);
      }
    }

    if (providers.length === 0) {
      for (const [type, config] of Object.entries(this.providerConfigs)) {
        try {
          const provider = await this.createProviderByType(type as ProviderType, config);
          if (provider.supportsChannel(channel)) {
            providers.push(provider);
          }
        } catch (error) {
          console.warn(`Failed to create provider ${type}:`, error);
        }
      }
    }
    
    return providers;
  }

  static async getProviderAndChannelForMarket(
    marketContext: MarketContext,
    messageType?: string
  ): Promise<{ provider: BaseProvider; channel: string; selection: ChannelSelectionResult }> {
    const selection = await this.selectChannel(marketContext, messageType);
    const provider = await this.getProviderForChannel(marketContext, selection.channel);
    
    return {
      provider,
      channel: selection.channel,
      selection,
    };
  }

  static async createProviderByType(type: ProviderType, config: Record<string, any>): Promise<BaseProvider> {
    let provider: BaseProvider;

    switch (type) {
      case 'infobip':
        const infobipConfig: InfobipConfig = {
          baseUrl: config['baseUrl'],
          apiKey: config['apiKey'],
        };

        if (!infobipConfig.baseUrl || !infobipConfig.apiKey) {
          throw new Error('Infobip provider requires baseUrl and apiKey configuration');
        }

        provider = new InfobipProvider(infobipConfig);
        break;
      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }

    return provider;
  }

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
