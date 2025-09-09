import { v4 as uuidv4 } from "uuid";
import { ListMessage } from "../../types/messages/list-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipListHandler extends BaseHandler<ListMessage> {
  type: ListMessage["type"] = "list";

  async send(
    message: ListMessage,
    channelId: string,
    to: string | string[],
    from?: string
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];

      switch (channelId) {
        case "viber": {
          const endpoint = "/viber/2/messages";
          const payload = {
            messages: recipients.map((recipient) => ({
              sender: from || process.env["INFOBIP_VIBER_FROM"],
              destinations: [{ to: recipient }],
              content: {
                type: "LIST",
                text: message.text,
                options: message.options,
              },
              options: {
                label: "TRANSACTIONAL",
                applySessionRate: false,
                toPrimaryDeviceOnly: false,
              },
            })),
          };

          const response = await this.client.post(endpoint, payload);
          console.log(
            `[viber] Infobip list message sent successfully:`,
            response.data
          );
          break;
        }

        case "whatsapp": {
          const endpoint = "/whatsapp/1/message/interactive/list";

          for (const recipient of recipients) {
            const sections = [
              {
                rows: (message.options || []).map((opt) => ({
                  id: uuidv4(),
                  title: opt,
                })),
              },
            ];

            const payload = {
              from: from || process.env["INFOBIP_WHATSAPP_FROM"],
              to: recipient,
              content: {
                body: {
                  text: message.text,
                },
                action: {
                  title: message.actionTitle,
                  sections,
                },
              },
            };

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[whatsapp] Infobip list message sent successfully to ${recipient}:`,
              response.data
            );
          }
          break;
        }

        default:
          throw new Error(`Unsupported channel for list message: ${channelId}`);
      }
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip list message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
