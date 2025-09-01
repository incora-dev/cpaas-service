import { AudioMessage } from "../../types/message-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipAudioHandler extends BaseHandler<AudioMessage> {
  type: AudioMessage["type"] = "audio";

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
            from:
              from || process.env["INFOBIP_WHATSAPP_FROM"],
            to,
            content: { mediaUrl: message.mediaUrl },
          };
          break;

        default:
          throw new Error(
            `Unsupported channel for audio message: ${channelId}`
          );
      }

      const response = await this.client.post(endpoint, payload);
      console.log(
        `[${channelId}] Infobip audio message sent successfully:`,
        response.data
      );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip audio message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
