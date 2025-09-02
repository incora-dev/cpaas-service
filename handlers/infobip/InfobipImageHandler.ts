import { ImageMessage } from '../../types/message-types';
import { BaseHandler } from '../BaseHandler';

export class InfobipImageHandler extends BaseHandler<ImageMessage> {
  type: ImageMessage['type'] = 'image';

  async send(message: ImageMessage, channelId: string, to: string, from?: string): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "whatsapp":
          endpoint = "/whatsapp/1/message/image";
          payload = {
            from: from || process.env["INFOBIP_WHATSAPP_FROM"],
            to,
            content: {
              mediaUrl: message.mediaUrl,
              caption: message.caption,
            },
          };
          break;

        case "viber":
          endpoint = "/viber/2/messages";
          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_VIBER_FROM"],
                destinations: [{ to }],
                content: {
                  mediaUrl: message.mediaUrl,
                  caption: message.caption,
                  type: "IMAGE",
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

        case "rcs":
          endpoint = "/rcs/2/messages";
          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_RCS_FROM"],
                destinations: [{ to }],
                content: {
                  type: "FILE",
                  file: {
                    url: message.mediaUrl,
                  },
                },
              },
            ],
          };
          break;

        default:
          throw new Error(
            `Unsupported channel for image message: ${channelId}`
          );
      }

      const response = await this.client.post(endpoint, payload);
      console.log(`[${channelId}] Infobip image message sent successfully:`, response.data);
    } catch (error) {
      console.error(`[${channelId}] Error sending Infobip image message:`, error);
      throw error;
    }
  }
}
