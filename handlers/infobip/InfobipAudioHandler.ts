import { AudioMessage } from "../../types/messages/audio-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipAudioHandler extends BaseHandler<AudioMessage> {
  type: AudioMessage["type"] = "audio";

  async send(
    message: AudioMessage,
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
                    type: "DOCUMENT",
                    url: message.mediaUrl,
                    text: message.text,
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

        case "rcs": {
          endpoint = "/rcs/2/messages";
          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_RCS_FROM"],
                destinations: recipients.map((r) => ({ to: r })),
                content: {
                  type: "FILE",
                  file: {
                    url: message.mediaUrl,
                  },
                },
              },
            ],
          };
          break;
        }

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