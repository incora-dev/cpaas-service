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

      switch (channelId) {
        case "sms": {
          const endpoint = "/sms/2/text/advanced";
          const payload = {
            messages: [
              {
                destinations: recipients.map((r) => ({ to: r })),
                from: from || process.env["INFOBIP_SMS_FROM"],
                text: message.text,
              },
            ],
          };
          const response = await this.client.post(endpoint, payload);
          console.log(
            `[sms] Infobip text message sent successfully:`,
            response.data
          );
          break;
        }

        case "whatsapp": {
          const endpoint = "/whatsapp/1/message/text";

          for (const recipient of recipients) {
            const payload = {
              from: from || process.env["INFOBIP_WHATSAPP_FROM"],
              to: recipient,
              content: {
                text: message.text,
                previewLink: message.text.includes("http"),
                urlOptions: {
                  removeProtocol: false,
                },
              },
            };

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[whatsapp] Infobip text message sent successfully to ${recipient}:`,
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
          const response = await this.client.post(endpoint, payload);
          console.log(
            `[viber] Infobip text message sent successfully:`,
            response.data
          );
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
                  text: message.text,
                  type: "TEXT",
                },
              },
            ],
          };
          const response = await this.client.post(endpoint, payload);
          console.log(
            `[rcs] Infobip text message sent successfully:`,
            response.data
          );
          break;
        }

        default:
          throw new Error(`Unsupported channel for text message: ${channelId}`);
      }
    } catch (error) {
      console.error(
        `[${channelId}] Error sending Infobip text message:`,
        error
      );
      throw error;
    }
  }
}
