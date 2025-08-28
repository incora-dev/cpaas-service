import { ViberVideoMessage, VideoMessage } from '../../types/message-types';
import { BaseHandler } from '../BaseHandler';
import axios, { AxiosInstance } from 'axios';

export class InfobipVideoHandler extends BaseHandler<VideoMessage> {
  type: VideoMessage['type'] = 'video';
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

  async send(message: VideoMessage, channelId: string, to: string, from?: string): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case 'whatsapp':
          endpoint = '/whatsapp/1/message/video';
          payload = {
            from: from || process.env['INFOBIP_WHATSAPP_FROM'] || '447860088970',
            to,
            content: {
              mediaUrl: message.mediaUrl,
              caption: message.caption,
            },
            callbackData: 'Callback data',
            notifyUrl: 'https://www.example.com/whatsapp',
            urlOptions: {
              shortenUrl: true,
              trackClicks: true,
              trackingUrl: 'https://example.com/click-report',
              removeProtocol: true,
            }
          };
          break;

        case 'viber':
          endpoint = '/viber/2/messages';
          const viberMessage = message as ViberVideoMessage;
          payload = {
            messages: [
              {
                sender: from || process.env['INFOBIP_VIBER_FROM'] || 'IBSelfServe',
                destinations: [{ to }],
                content: {
                  mediaUrl: viberMessage.mediaUrl,
                  text: viberMessage.caption,
                  type: 'VIDEO',
                  mediaDuration: viberMessage.duration,
                  thumbnailUrl: viberMessage.thumbnailUrl
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
          throw new Error(`Unsupported channel for video message: ${channelId}`);
      }

      const response = await this.client.post(endpoint, payload);
      console.log(`[${channelId}] Infobip video message sent successfully:`, response.data);
    } catch (error: any) {
      console.error(`[${channelId}] Error sending Infobip video message:`, error);
      throw error;
    }
  }
}
