import { CardMessage } from "../../types/messages/card-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipCardHandler extends BaseHandler<CardMessage> {
  type: CardMessage["type"] = "card";

  async send(
    message: CardMessage,
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
                    type: "RICH_LINK",
                    url: message.mediaUrl,
                    text: message.title,
                    redirectUrl: message.redirectUrl,
                    isVideo: message.isVideo,
                  },
                },
              }
            ],
          };
          break;
        }
          
        case "rcs": {
          endpoint = "/rcs/2/messages";

          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_RCS_FROM"],
                destinations: recipients.map((r) => ({ to: r })),
                content: {
                  type: "CARD",
                  orientation: message.orientation,
                  alignment: message.alignment,
                  content: {
                    title: message.title,
                    description: message.description,
                    media: {
                      file: { url: message.mediaUrl },
                      thumbnail: { url: message.thumbnailUrl },
                      height: message.height,
                    },
                  },
                },
              },
            ],
          };
          break;
        }

        default:
          throw new Error(`Unsupported channel for card message: ${channelId}`);
      }

      const response = await this.client.post(endpoint, payload);
      console.log(
        `[${channelId}] Infobip card message sent successfully:`,
        response.data
      );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip card message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
