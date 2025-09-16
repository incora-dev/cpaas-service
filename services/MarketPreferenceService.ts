import { 
  MarketContext, 
  MarketPreference,
  ChannelTableItem, 
  ChannelSelectionResult
} from '../types/dynamodb-config.types';
import { 
  getMarketFromContext,
  sortByPriority,
  selectRandomWithWeight,
  isChannelCompatibleWithMessageType,
} from '../utils/market-preferences.utils';

export interface MarketPreferenceServiceOptions {
  enableRandomFallback?: boolean;
  randomFallbackWeight?: number;
  logSelectionProcess?: boolean;
}

export class MarketPreferenceService {
  private options: MarketPreferenceServiceOptions;

  constructor(options: MarketPreferenceServiceOptions = {}) {
    this.options = {
      enableRandomFallback: true,
      randomFallbackWeight: 0.1,
      logSelectionProcess: false,
      ...options,
    };
  }

  async selectChannel(
    channels: ChannelTableItem[],
    marketContext: MarketContext,
    messageType?: string
  ): Promise<ChannelSelectionResult> {
    const market = getMarketFromContext(marketContext);
    
    if (this.options.logSelectionProcess) {
      console.log(`[MarketPreferenceService] Selecting channel for market: ${market}`);
    }

    const activeChannels = channels.filter(c => c.isActive);
    if (activeChannels.length === 0) {
      throw new Error('No active channels available');
    }

    const channelsWithPreferences = this.findChannelsWithMarketPreferences(activeChannels, market);
    
    if (channelsWithPreferences.length > 0) {
      const result = this.selectFromMarketPreferences(channelsWithPreferences, market, messageType);
      if (result) {
        if (this.options.logSelectionProcess) {
          console.log(`[MarketPreferenceService] Selected channel ${result.channel} based on market preferences`);
        }
        return result;
      }
    }

    if (this.options.enableRandomFallback) {
      const randomResult = this.selectRandomChannel(activeChannels, market, messageType);
      if (this.options.logSelectionProcess) {
        console.log(`[MarketPreferenceService] Fallback to random selection: channel ${randomResult.channel}`);
      }
      return randomResult;
    }

    const fallbackChannel = activeChannels[0];
    
    return {
      channel: fallbackChannel?.channelType || 'sms',
      reason: 'fallback',
      market,
      priority: 999,
      weight: 1,
    };
  }

  private findChannelsWithMarketPreferences(
    channels: ChannelTableItem[], 
    market: string
  ): ChannelTableItem[] {
    return channels.filter(channel => 
      channel.marketPreferences?.some(pref => 
        pref.market === market || pref.market === 'GLOBAL'
      )
    );
  }

  private selectFromMarketPreferences(
    channels: ChannelTableItem[],
    market: string,
    messageType?: string
  ): ChannelSelectionResult | null {
    const marketPreferences: Array<{
      channel: ChannelTableItem;
      preference: MarketPreference;
    }> = [];

    for (const channel of channels) {
      if (!channel.marketPreferences) continue;

      for (const preference of channel.marketPreferences) {
        if (preference.market === market || preference.market === 'GLOBAL') {
          if (messageType && !isChannelCompatibleWithMessageType(channel.channelType, messageType)) {
            continue;
          }

          marketPreferences.push({
            channel,
            preference,
          });
        }
      }
    }

    if (marketPreferences.length === 0) {
      return null;
    }

    const sortedPreferences = sortByPriority(marketPreferences.map(p => ({
      ...p,
      priority: p.preference.priority,
    })));

    const topPriority = sortedPreferences[0]?.priority || 0;
    const topPriorityItems = sortedPreferences.filter(p => p.priority === topPriority);

    const selected = selectRandomWithWeight(topPriorityItems);

    if (!selected) return null;

    return {
      channel: selected.channel.channelType,
      reason: 'market-preference',
      market,
      priority: selected.preference.priority,
      weight: selected.preference.weight,
    };
  }

  private selectRandomChannel(
    channels: ChannelTableItem[],
    market: string,
    messageType?: string
  ): ChannelSelectionResult {
    const compatibleChannels = messageType 
      ? channels.filter(channel => isChannelCompatibleWithMessageType(channel.channelType, messageType))
      : channels;

    const marketSpecificChannels = compatibleChannels.map(c => ({ channel: c, preference: { weight: 1, priority: 999, market } }));
    const selectedChannel = selectRandomWithWeight(marketSpecificChannels) || marketSpecificChannels[0];

    return {
      channel: selectedChannel?.channel?.channelType || 'sms',
      reason: 'random',
      market,
      priority: 999,
      weight: 1,
    };
  }
}
