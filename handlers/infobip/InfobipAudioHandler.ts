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

      switch (channelId) {
        case "whatsapp": {
          const endpoint = "/whatsapp/1/message/audio";

          for (const recipient of recipients) {
            const payload = {
              from: from || process.env["INFOBIP_WHATSAPP_FROM"],
              to: recipient,
              content: { mediaUrl: message.mediaUrl },
            };

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[whatsapp] Infobip audio message sent successfully to ${recipient}:`,
              response.data
            );
          }
          break;
        }

        case "rcs": {
          const endpoint = "/rcs/2/messages";
          const payload = {
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

          const response = await this.client.post(endpoint, payload);
          console.log(
            `[rcs] Infobip audio message sent successfully:`,
            response.data
          );
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for audio message: ${channelId}`
          );
      }
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip audio message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}