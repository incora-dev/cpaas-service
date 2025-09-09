export interface DynamoDBTableConfig {
  tableName: string;
  region: string;
  endpoint?: string;
}

export interface ChannelTableItem {
  id: string;
  channelType: string;
  isActive: boolean;
  marketPreferences?: MarketPreference[];
}

export interface MarketSpecificChannelTableItem {
  channel: ChannelTableItem;
  preference: MarketPreference;
}

export interface MarketPreference {
  market: string;
  priority: number;
  weight: number;
}

export interface ChannelPreference {
  channelType: string;
  priority: number;
  weight: number;
  isPreferred: boolean;
  fallbackChannels?: string[];
}

export interface MarketContext {
  market: string;
  country?: string;
  language?: string;
  timezone?: string;
}

export interface ChannelSelectionResult {
  channel: string;
  reason: 'market-preference' | 'fallback' | 'random';
  market: string;
  priority: number;
  weight: number;
}
