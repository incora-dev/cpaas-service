import { ListMessage, WhatsAppListMessage, ViberListMessage } from '../../types/message-types';
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
          const viberMessage = message as ViberListMessage;
          payload = {
            messages: [
              {
                sender:
                  from || process.env["INFOBIP_VIBER_FROM"] || "IBSelfServe",
                destinations: [{ to }],
                content: {
                  type: "LIST",
                  text: message.text,
                  options: viberMessage.options,
                },
                options: {
                  label: "TRANSACTIONAL",
                  applySessionRate: false,
                  toPrimaryDeviceOnly: false,
                },
              },
            ],
          };
          break;

        case 'whatsapp':
          endpoint = '/whatsapp/1/message/interactive/list';
          const whatsappMessage = message as WhatsAppListMessage;
          payload = {
            from:
              from || process.env["INFOBIP_WHATSAPP_FROM"] || "447860088970",
            to,
            messageId: whatsappMessage.messageId || undefined,
            content: {
              body: {
                text: whatsappMessage.text,
              },
              action: {
                title: whatsappMessage.actionTitle || "Choose one",
                sections: whatsappMessage.sections,
              },
            },
            callbackData: "Callback data",
            notifyUrl: "https://www.example.com/whatsapp",
            urlOptions: {
              shortenUrl: true,
              trackClicks: true,
              trackingUrl: "https://example.com/click-report",
              removeProtocol: true,
            },
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
