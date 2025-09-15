import { ImageMessage } from "../../types/messages/image-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipImageHandler extends BaseHandler<ImageMessage> {
  type: ImageMessage["type"] = "image";

  async send(
    message: ImageMessage,
    channelId: string,
    to: string | string[],
    from?: string
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "whatsapp": {
          endpoint = "/messages-api/1/messages";

          payload = {
            messages: [
              {
                channel: "WHATSAPP",
                sender: from || process.env["INFOBIP_WHATSAPP_FROM"],
                destinations: recipients.map((r) => ({ to: r })),
                content: {
                  body: {
                    type: "IMAGE",
                    url: message.mediaUrl,
                    text: message.caption,
                  },
                  buttons: message.buttons?.map((btn) => ({
                    type: btn.type, 
                    text: btn.text, 
                    postbackData: btn.postbackData, 
                  })),
                },
              },
            ],
          };
          break;
        }

        case "viber": {
          endpoint = "/viber/2/messages";
          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_VIBER_FROM"],
                destinations: recipients.map((r) => ({ to: r })),
                content: {
                  mediaUrl: message.mediaUrl,
                  text: message.caption,
                  type: "IMAGE",
                  button: message.button,
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
        }

        case "rcs": {
          endpoint = "/rcs/2/messages";
          payload = {
            messages: recipients.map((recipient) => ({
              sender: from || process.env["INFOBIP_RCS_FROM"],
              destinations: [{ to: recipient }],
              content: {
                type: "FILE",
                file: {
                  url: message.mediaUrl,
                },
              },
            })),
          };
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for image message: ${channelId}`
          );
      }

       const response = await this.client.post(endpoint, payload);
       console.log(
         `[${channelId}] Infobip image message sent successfully:`,
         response.data
       );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip image message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}