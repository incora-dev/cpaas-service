import {
  VideoMessage,
} from "../../types/messages/video-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipVideoHandler extends BaseHandler<VideoMessage> {
  type: VideoMessage["type"] = "video";

  async send(
    message: VideoMessage,
    channelId: string,
    to: string,
    from?: string
  ): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "whatsapp":
          endpoint = "/whatsapp/1/message/video";
          payload = {
            from: from || process.env["INFOBIP_WHATSAPP_FROM"],
            to,
            content: {
              mediaUrl: message.mediaUrl,
              caption: message.caption,
            },
          };
          break;

        case "viber":
          endpoint = "/viber/2/messages";
          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_VIBER_FROM"],
                destinations: [{ to }],
                content: {
                  mediaUrl: message.mediaUrl,
                  text: message.caption,
                  type: "VIDEO",
                  mediaDuration: message.duration,
                  thumbnailUrl: message.thumbnailUrl,
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

        case "rcs":
          endpoint = "/rcs/2/messages";
          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_RCS_FROM"],
                destinations: [{ to }],
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
        error
      );
      throw error;
    }
  }
}
