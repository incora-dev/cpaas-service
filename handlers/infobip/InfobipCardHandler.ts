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

      switch (channelId) {
        case "rcs": {
          const endpoint = "/rcs/2/messages";

            const payload = {
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

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[rcs] Infobip card message sent successfully:`,
              response.data
            );
          break;
        }

        default:
          throw new Error(`Unsupported channel for card message: ${channelId}`);
      }
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip card message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
