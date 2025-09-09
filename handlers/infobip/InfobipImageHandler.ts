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

      switch (channelId) {
        case "whatsapp": {
          const endpoint = "/whatsapp/1/message/image";

          for (const recipient of recipients) {
            const payload = {
              from: from || process.env["INFOBIP_WHATSAPP_FROM"],
              to: recipient,
              content: {
                mediaUrl: message.mediaUrl,
                caption: message.caption,
              },
            };

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[whatsapp] Infobip image message sent successfully to ${recipient}:`,
              response.data
            );
          }
          break;
        }

        case "viber": {
          const endpoint = "/viber/2/messages";
          const payload = {
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

          const response = await this.client.post(endpoint, payload);
          console.log(
            `[viber] Infobip image message sent successfully:`,
            response.data
          );
          break;
        }

        case "rcs": {
          const endpoint = "/rcs/2/messages";
          const payload = {
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

          const response = await this.client.post(endpoint, payload);
          console.log(
            `[rcs] Infobip image message sent successfully:`,
            response.data
          );
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for image message: ${channelId}`
          );
      }
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip image message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}