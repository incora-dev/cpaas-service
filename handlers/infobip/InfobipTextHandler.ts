import { TextMessage } from "../../types/messages/text-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipTextHandler extends BaseHandler<TextMessage> {
  type: TextMessage["type"] = "text";

  async send(
    message: TextMessage,
    channelId: string,
    to: string | string[],
    from?: string
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "sms": {
          endpoint = "/sms/2/text/advanced";

          payload = {
            messages: [
              {
                destinations: recipients.map((r) => ({ to: r })),
                from: from || process.env["INFOBIP_SMS_FROM"],
                text: message.text,
              },
            ],
          };
          break;
        }

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
                    type: "TEXT",
                    text: message.text,
                  },
                  buttons: message.buttons?.map((btn) => ({
                    type: btn.type, 
                    text: btn.text, 
                    postbackData: btn.postbackData, 
                    url: btn.url,
                  })),
                },
              },
            ],
          };
          break;
        }

        case "viber": {
          endpoint = "/viber/2/messages";

          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_VIBER_FROM"],
                destinations: recipients.map((r) => ({ to: r })),
                content: {
                  text: message.text,
                  type: "TEXT",
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
                  text: message.text,
                  type: "TEXT",
                },
              },
            ],
          };
          break;
        }

        default:
          throw new Error(`Unsupported channel for text message: ${channelId}`);
      }

       const response = await this.client.post(endpoint, payload);
       console.log(
         `[${channelId}] Infobip text message sent successfully:`,
         response.data
       );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip text message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
