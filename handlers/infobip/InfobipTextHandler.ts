import { TextMessage } from "../../types/messages/text-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipTextHandler extends BaseHandler<TextMessage> {
  type: TextMessage["type"] = "text";

  async send(
    message: TextMessage,
    channelId: string,
    to: string,
    from?: string
  ): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "sms":
          endpoint = "/sms/2/text/advanced";
          payload = {
            messages: [
              {
                destinations: [{ to }],
                from: from || process.env["INFOBIP_SMS_FROM"],
                text: message.text,
              },
            ],
          };
          break;

        case "whatsapp":
          endpoint = "/whatsapp/1/message/text";
          payload = {
            from: from || process.env["INFOBIP_WHATSAPP_FROM"],
            to,
            content: {
              text: message.text,
              previewLink: message.text.includes("http"),
              urlOptions: {
                removeProtocol: false,
              },
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
                  text: message.text,
                  type: "TEXT",
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
                  text: message.text,
                  type: "TEXT",
                },
              },
            ],
          };
          break;

        default:
          throw new Error(`Unsupported channel for text message: ${channelId}`);
      }

      const response = await this.client.post(endpoint, payload);
      console.log(
        `[${channelId}] Infobip text message sent successfully:`,
        response.data
      );
    } catch (error) {
      console.error(
        `[${channelId}] Error sending Infobip text message:`,
        error
      );
      throw error;
    }
  }
}
