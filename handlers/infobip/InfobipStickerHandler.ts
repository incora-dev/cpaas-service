import { StickerMessage } from "../../types/messages/sticker-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipStickerHandler extends BaseHandler<StickerMessage> {
  type: StickerMessage["type"] = "sticker";

  async send(
    message: StickerMessage,
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
                    type: "STICKER",
                    reference: message.mediaUrl,
                  }
                },
              },
            ],
          };
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for sticker message: ${channelId}`
          );
      }

       const response = await this.client.post(endpoint, payload);
       console.log(
         `[${channelId}] Infobip sticker message sent successfully:`,
         response.data
       );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip sticker message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
