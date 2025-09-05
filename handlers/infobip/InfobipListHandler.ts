import { v4 as uuidv4 } from "uuid"; 
import { ListMessage } from "../../types/messages/list-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipListHandler extends BaseHandler<ListMessage> {
  type: ListMessage["type"] = "list";

  async send(
    message: ListMessage,
    channelId: string,
    to: string,
    from?: string
  ): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "viber":
          endpoint = "/viber/2/messages";
          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_VIBER_FROM"],
                destinations: [{ to }],
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
              },
            ],
          };
          break;

        case "whatsapp":
          endpoint = "/whatsapp/1/message/interactive/list";

          const sections = [
            {
              rows: (message.options || []).map((opt) => ({
                id: uuidv4(), 
                title: opt, 
              })),
            },
          ];

          payload = {
            from: from || process.env["INFOBIP_WHATSAPP_FROM"],
            to,
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
          break;

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
        error
      );
      throw error;
    }
  }
}
