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
                    type: "VIDEO",
                    url: message.mediaUrl,
                    text: message.caption,
                  }
                },
              },
            ],
          };
          break;
        }

        case "viber":
          {
            endpoint = "/viber/2/messages";

            payload = {
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
                  thumbnail: {
                    url: message.thumbnailUrl,
                  },
                },
              },
            ],
          };
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for video message: ${channelId}`
          );
      }

       const response = await this.client.post(endpoint, payload);
       console.log(
         `[${channelId}] Infobip video message sent successfully:`,
         response.data
       );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip video message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
