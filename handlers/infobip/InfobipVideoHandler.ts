import { VideoMessage } from "../../types/messages/video-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipVideoHandler extends BaseHandler<VideoMessage> {
  type: VideoMessage["type"] = "video";

  async send(
    message: VideoMessage,
    channelId: string,
    to: string | string[],
    from?: string
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];

      switch (channelId) {
        case "whatsapp": {
          const endpoint = "/whatsapp/1/message/video";

          for (const recipient of recipients) {
            const payload = {
              from: from || process.env["INFOBIP_WHATSAPP_FROM"],
              to: recipient,
              content: {
                mediaUrl: message.mediaUrl,
                caption: message.caption,
              },
            };

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[whatsapp] Infobip video message sent successfully to ${recipient}:`,
              response.data
            );
          }
          break;
        }

        case "viber": {
          const endpoint = "/viber/2/messages";

            const payload = {
              messages: [
                {
                  sender: from || process.env["INFOBIP_VIBER_FROM"],
                  destinations: recipients.map((r) => ({ to: r })),
                  content: {
                    mediaUrl: message.mediaUrl,
                    text: message.caption,
                    type: "VIDEO",
                    mediaDuration: message.duration,
                    thumbnailUrl: message.thumbnailUrl,
                    button: message.button,
                  },
                  options: {
                    label: "TRANSACTIONAL",
                    applySessionRate: false,
                    toPrimaryDeviceOnly: false,
                  },
                },
              ],
            };

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[viber] Infobip video message sent successfully:`,
              response.data
            );
          }
          break;

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
                    thumbnail: {
                      url: message.thumbnailUrl,
                    },
                  },
                },
              ],
            };

            const response = await this.client.post(endpoint, payload);
          console.log(
            `[rcs] Infobip video message sent successfully:`,
            response.data
          );
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for video message: ${channelId}`
          );
      }
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip video message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
