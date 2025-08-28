import { ListMessage } from '../../types/message-types';
import { BaseHandler } from '../BaseHandler';
import axios, { AxiosInstance } from 'axios';

export class InfobipListHandler extends BaseHandler<ListMessage> {
  type: ListMessage['type'] = 'list';
  private client: AxiosInstance;

  constructor(config: { baseUrl: string; apiKey: string }) {
    super();
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `App ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async send(message: ListMessage, channelId: string, to: string, from?: string): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case 'viber':
          endpoint = '/viber/2/messages';
          payload = {
            messages: [
              {
                sender: from || process.env['INFOBIP_VIBER_FROM'] || 'IBSelfServe',
                destinations: [{ to }],
                content: {
                  type: 'LIST',
                  text: message.text,
                  options: message.options
                },
                options: {
                  label: 'TRANSACTIONAL',
                  applySessionRate: false,
                  toPrimaryDeviceOnly: false
                }
              }
            ]
          };
          break;

        default:
          throw new Error(`Unsupported channel for list message: ${channelId}`);
      }

      const response = await this.client.post(endpoint, payload);
      console.log(`[${channelId}] Infobip list message sent successfully:`, response.data);
    } catch (error: any) {
      console.error(`[${channelId}] Error sending Infobip list message:`, error);
      throw error;
    }
  }
}
