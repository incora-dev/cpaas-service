import {
  FileMessage,
  ViberFileMessage,
  WhatsappFileMessage,
} from "../../types/messages/file-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipFileHandler extends BaseHandler<FileMessage> {
  type: FileMessage["type"] = "file";

  async send(
    message: FileMessage,
    channelId: string,
    to: string,
    from?: string
  ): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "whatsapp":
          endpoint = "/whatsapp/1/message/document";
          const whatsappMessage = message as WhatsappFileMessage;
          payload = {
            from: from || process.env["INFOBIP_WHATSAPP_FROM"],
            to,
            content: {
              mediaUrl: whatsappMessage.mediaUrl,
              caption: whatsappMessage.caption,
              filename: whatsappMessage.filename,
            },
          };
          break;

        case "viber":
          endpoint = "/viber/2/messages";
          const viberMessage = message as ViberFileMessage;
          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_VIBER_FROM"],
                destinations: [{ to }],
                content: {
                  type: "FILE",
                  mediaUrl: viberMessage.mediaUrl,
                  fileName: viberMessage.fileName,
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
                },
              },
            ],
          };
          break;

        default:
          throw new Error(`Unsupported channel for file message: ${channelId}`);
      }

      const response = await this.client.post(endpoint, payload);
      console.log(
        `[${channelId}] Infobip file message sent successfully:`,
        response.data
      );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip file message:`,
        error
      );
      throw error;
    }
  }
}
