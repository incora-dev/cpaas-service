import { StickerMessage } from "../../types/messages/sticker-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipStickerHandler extends BaseHandler<StickerMessage> {
  type: StickerMessage["type"] = "sticker";

  async send(
    message: StickerMessage,
    channelId: string,
    to: string,
    from?: string
  ): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "whatsapp":
          endpoint = "/whatsapp/1/message/sticker";
          payload = {
            from: from || process.env["INFOBIP_WHATSAPP_FROM"],
            to,
            content: { mediaUrl: message.mediaUrl },
          };
          break;

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
        error
      );
      throw error;
    }
  }
}
