import { MarketContext, MarketSpecificChannelTableItem } from '../types/dynamodb-config.types';

/**
 * Get market identifier from market context
 */
export function getMarketFromContext(context: MarketContext): string {
  return context.market || 'GLOBAL';
}

/**
 * Sort items by priority (lower number = higher priority)
 */
export function sortByPriority<T extends { priority: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.priority - b.priority);
}

/**
 * Select a random item using weighted selection based on market preferences
 */
export function selectRandomWithWeight<T extends MarketSpecificChannelTableItem>(items: T[]): T | null {
  if (items.length === 0) return null;
  
  const totalWeight = items.reduce((sum, item) => sum + item.preference.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.preference.weight;
    if (random <= 0) {
      return item;
    }
  }

  return items[0] || null;
}

/**
 * Validate if a channel type is supported
 */
export function validateChannelConfig(channelType: string): boolean {
  const validChannels = ['sms', 'viber', 'whatsapp', 'email'];
  return validChannels.includes(channelType);
}

/**
 * Check if a channel is compatible with a message type
 */
export function isChannelCompatibleWithMessageType(channelType: string, messageType: string): boolean {
  const compatibilityMap: Record<string, string[]> = {
    'sms': ['text'],
    'viber': ['text', 'image', 'carousel',],
    'whatsapp': ['text', 'image'],
  };

  const compatibleTypes = compatibilityMap[channelType] || [];
  return compatibleTypes.includes(messageType);
}

/**
 * Filter channels by message type compatibility
 */
export function filterChannelsByMessageType<T extends { channelType: string }>(
  channels: T[], 
  messageType: string
): T[] {
  return channels.filter(channel => 
    isChannelCompatibleWithMessageType(channel.channelType, messageType)
  );
}
