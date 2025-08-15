import { CarouselMessage } from '../../types/message-types';
import { BaseHandler } from '../BaseHandler';
import axios, { AxiosInstance } from 'axios';

export class InfobipCarouselHandler extends BaseHandler<CarouselMessage> {
  type: CarouselMessage['type'] = 'carousel';
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

  async send(message: CarouselMessage, channelId: string, to: string, from?: string): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case 'viber':
          endpoint = '/viber/2/messages';
          const cards = message.items.map(item => ({
            text: item.title,
            mediaUrl: item.mediaUrl,
            description: item.description,
            buttons: item.buttons,
          }));

          payload = {
            messages: [
              {
                sender: from || process.env['INFOBIP_VIBER_FROM'] || 'IBSelfServe',
                destinations: [{ to }],
                content: {
                  text: 'Check out these options:',
                  type: 'CAROUSEL',
                  cards
                },
                options: {
                  label: 'TRANSACTIONAL',
                  applySessionRate: false,
                  toPrimaryDeviceOnly: false
                }
              },
            ],
          };
          break;

        default:
          throw new Error(`Unsupported channel for carousel message: ${channelId}`);
      }

      const response = await this.client.post(endpoint, payload);
      console.log(`[${channelId}] Infobip carousel message sent successfully:`, response.data);
    } catch (error) {
      console.error(`[${channelId}] Error sending Infobip carousel message:`, error);
      throw error;
    }
  }
}
