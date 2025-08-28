import { FileMessage, ViberFileMessage } from '../../types/message-types';
import { BaseHandler } from '../BaseHandler';
import axios, { AxiosInstance } from 'axios';

export class InfobipFileHandler extends BaseHandler<FileMessage> {
  type: FileMessage['type'] = 'file';
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

  async send(message: FileMessage, channelId: string, to: string, from?: string): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case 'whatsapp':
          endpoint = '/whatsapp/1/message/document';
          payload = {
            from: from || process.env['INFOBIP_WHATSAPP_FROM'] || '447860088970',
            to,
            content: {
              mediaUrl: message.mediaUrl
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
          const viberMessage = message as ViberFileMessage;
          payload = {
            messages: [
              {
                sender: from || process.env['INFOBIP_VIBER_FROM'] || 'IBSelfServe',
                destinations: [{ to }],
                content: {
                  type: 'FILE',
                  mediaUrl: viberMessage.mediaUrl,
                  fileName: viberMessage.fileName
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
          throw new Error(`Unsupported channel for file message: ${channelId}`);
      }

      const response = await this.client.post(endpoint, payload);
      console.log(`[${channelId}] Infobip file message sent successfully:`, response.data);
    } catch (error: any) {
      console.error(`[${channelId}] Error sending Infobip file message:`, error);
      throw error;
    }
  }
}
