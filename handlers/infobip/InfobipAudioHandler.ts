import { AudioMessage } from "../../types/message-types";
import { BaseHandler } from "../BaseHandler";
import axios, { AxiosInstance } from "axios";

export class InfobipAudioHandler extends BaseHandler<AudioMessage> {
  type: AudioMessage["type"] = "audio";
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
    message: AudioMessage,
    channelId: string,
    to: string,
    from?: string
  ): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "whatsapp":
          endpoint = "/whatsapp/1/message/audio";
          payload = {
            from: from || process.env["INFOBIP_WHATSAPP_FROM"] || "447860088970",
            to,
            content: { mediaUrl: message.mediaUrl },
            callbackData: "Callback data",
            notifyUrl: "https://www.example.com/whatsapp",
          };
          break;

        default:
          throw new Error(`Unsupported channel for audio message: ${channelId}`);
      }

      const response = await this.client.post(endpoint, payload);
      console.log(
        `[${channelId}] Infobip audio message sent successfully:`,
        response.data
      );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip audio message:`,
        error
      );
      throw error;
    }
  }
}
