import { StickerMessage } from "../../types/message-types";
import { BaseHandler } from "../BaseHandler";
import axios, { AxiosInstance } from "axios";

export class InfobipStickerHandler extends BaseHandler<StickerMessage> {
  type: StickerMessage["type"] = "sticker";
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
            from:
              from || process.env["INFOBIP_WHATSAPP_FROM"] || "447860088970",
            to,
            messageId: message.messageId || undefined,
            content: { mediaUrl: message.mediaUrl },
            callbackData: "Callback data",
            notifyUrl: "https://www.example.com/whatsapp",
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
