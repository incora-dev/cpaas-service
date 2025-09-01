import { ListMessage, WhatsAppListMessage, ViberListMessage } from '../../types/message-types';
import { BaseHandler } from '../BaseHandler';

export class InfobipListHandler extends BaseHandler<ListMessage> {
  type: ListMessage['type'] = 'list';

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
                  from || process.env["INFOBIP_VIBER_FROM"],
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
              from || process.env["INFOBIP_WHATSAPP_FROM"],
            to,
            content: {
              body: {
                text: whatsappMessage.text,
              },
              action: {
                title: whatsappMessage.actionTitle,
                sections: whatsappMessage.sections,
              },
            }
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
