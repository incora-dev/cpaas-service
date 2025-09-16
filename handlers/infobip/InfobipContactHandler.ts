import { ContactMessage } from "../../types/messages/contact-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipContactHandler extends BaseHandler<ContactMessage> {
  type: ContactMessage["type"] = "contact";

  async send(
    message: ContactMessage,
    channelId: string,
    to: string | string[],
    from?: string
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];

      switch (channelId) {
        case "whatsapp": {
          const endpoint = "/whatsapp/1/message/contact";

          for (const recipient of recipients) {
            const payload = {
              from: from || process.env["INFOBIP_WHATSAPP_FROM"],
              to: recipient,
              content: {
                contacts: message.contacts,
              },
            };

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[whatsapp] Infobip contact message sent successfully to ${recipient}:`,
              response.data
            );
          }
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for contact message: ${channelId}`
          );
      }
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip contact message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
