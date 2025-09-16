import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ChannelTableItem, MarketContext } from '../types/dynamodb-config.types';
import { isChannelCompatibleWithMessageType } from '../utils/market-preferences.utils';

export interface DynamoDBChannelConfig {
  id: string;
  channelType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  marketPreferences?: any[];
}

export interface DynamoDBConfigServiceOptions {
  tableName: string;
  region?: string;
  endpoint?: string;
}

export class DynamoDBConfigService {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor(options: DynamoDBConfigServiceOptions) {
    const dynamoClient = new DynamoDBClient({
      region: options.region || process.env['AWS_REGION'] || 'us-east-1',
      // endpoint: options.endpoint || process.env['DYNAMODB_ENDPOINT'] || '',
      credentials: {
        accessKeyId: process.env['AWS_CLIENT_ACCESS_KEY_ID'] || '',
        secretAccessKey: process.env['AWS_CLIENT_SECRET_ACCESS_KEY'] || '',
      },
    });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tableName = options.tableName;
  }

  async getChannelConfig(channelId: string): Promise<ChannelTableItem | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: {
          id: channelId,
        },
      });

      const response = await this.client.send(command);
      
      if (!response.Item) {
        return null;
      }

      return response.Item as ChannelTableItem;
    } catch (error) {
      console.error('Error fetching channel config from DynamoDB:', error);
      throw new Error(`Failed to fetch channel config: ${error}`);
    }
  }

  async getActiveChannels(): Promise<ChannelTableItem[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'isActive = :isActive',
        ExpressionAttributeValues: {
          ':isActive': true,
        },
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items as ChannelTableItem[];
    } catch (error) {
      console.error('Error fetching active channels from DynamoDB:', error);
      throw new Error(`Failed to fetch active channels: ${error}`);
    }
  }

  async getChannelsByType(channelType: string): Promise<ChannelTableItem[]> {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'channelType-index',
        KeyConditionExpression: 'channelType = :channelType',
        FilterExpression: 'isActive = :isActive',
        ExpressionAttributeValues: {
          ':channelType': channelType,
          ':isActive': true,
        },
      });

      const response = await this.client.send(command);
      
      if (!response.Items) {
        return [];
      }

      return response.Items as ChannelTableItem[];
    } catch (error) {
      console.error('Error fetching channels by type from DynamoDB:', error);
      throw new Error(`Failed to fetch channels by type: ${error}`);
    }
  }

  async getChannelsForMarket(market: string): Promise<ChannelTableItem[]> {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'market-index',
        KeyConditionExpression: 'market = :market',
        FilterExpression: 'isActive = :isActive',
        ExpressionAttributeValues: {
          ':market': market,
          ':isActive': true,
        },
      });

      const response = await this.client.send(command);
      const marketSpecificChannels = response.Items || [];

      const globalCommand = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'market-index',
        KeyConditionExpression: 'market = :market',
        FilterExpression: 'isActive = :isActive',
        ExpressionAttributeValues: {
          ':market': 'GLOBAL',
          ':isActive': true,
        },
      });

      const globalResponse = await this.client.send(globalCommand);
      const globalChannels = globalResponse.Items || [];

      const allChannels = [...marketSpecificChannels, ...globalChannels];
      const uniqueChannels = this.deduplicateChannels(allChannels);

      return uniqueChannels as ChannelTableItem[];
    } catch (error) {
      console.error('Error fetching channels for market from DynamoDB:', error);

      return this.getActiveChannels();
    }
  }

  async getChannelsForMarketContext(marketContext: MarketContext): Promise<ChannelTableItem[]> {
    const market = marketContext.market || 'GLOBAL';
    
    try {
      const marketChannels = await this.getChannelsForMarket(market);

      if (marketChannels.length > 0) {
        return marketChannels;
      }

      const globalChannels = await this.getChannelsForMarket('GLOBAL');
      if (globalChannels.length > 0) {
        return globalChannels;
      }

      return this.getActiveChannels();
    } catch (error) {
      console.error('Error fetching channels for market context:', error);
      return this.getActiveChannels();
    }
  }

  async getChannelsForMessageType(
    messageType: string, 
    marketContext: MarketContext
  ): Promise<ChannelTableItem[]> {
    const channels = await this.getChannelsForMarketContext(marketContext);

    return channels.filter(channel => {
      return isChannelCompatibleWithMessageType(channel.channelType, messageType);
    });
  }

  private deduplicateChannels(channels: any[]): any[] {
    const seen = new Set();
    return channels.filter(channel => {
      if (seen.has(channel.id)) {
        return false;
      }
      seen.add(channel.id);
      return true;
    });
  }


}
