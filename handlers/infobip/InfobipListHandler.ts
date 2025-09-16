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
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "viber": {
          endpoint = "/viber/2/messages";

          const options = message.sections.flatMap((section) =>
            section.items.map((item) => item.text)
          );

          payload = {
            messages: recipients.map((recipient) => ({
              sender: from || process.env["INFOBIP_VIBER_FROM"],
              destinations: [{ to: recipient }],
              content: {
                type: "LIST",
                text: message.text,
                options: options
              },
              options: {
                label: "TRANSACTIONAL",
                applySessionRate: false,
                toPrimaryDeviceOnly: false,
              },
            })),
          };
          break;
        }

        case "whatsapp": {
          endpoint = "/messages-api/1/messages";

          const sections = message.sections.map((section) => ({
            sectionTitle: section.sectionTitle,
            items: section.items.map((item) => ({
              id: uuidv4(),
              text: item.text,
              description: item.description,
            })),
          }));

          payload = {
            messages: [
              {
                channel: "WHATSAPP",
                sender: from || process.env["INFOBIP_WHATSAPP_FROM"],
                destinations: recipients.map((r) => ({ to: r })),
                content: {
                  body: {
                    type: "LIST",
                    text: message.text,
                    subtext: message.actionTitle,
                    sections,
                  },
                },
              },
            ],
          };
          break;
        }

        default:
          throw new Error(`Unsupported channel for list message: ${channelId}`);
      }

       const response = await this.client.post(endpoint, payload);
       console.log(
         `[${channelId}] Infobip list message sent successfully:`,
         response.data
       );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip list message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
