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

      switch (channelId) {
        case "whatsapp": {
          const endpoint = "/whatsapp/1/message/sticker";

          for (const recipient of recipients) {
            const payload = {
              from: from || process.env["INFOBIP_WHATSAPP_FROM"],
              to: recipient,
              content: { mediaUrl: message.mediaUrl },
            };

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[whatsapp] Infobip sticker message sent successfully to ${recipient}:`,
              response.data
            );
          }
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for sticker message: ${channelId}`
          );
      }
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip sticker message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
