import { ContactMessage } from "../../types/messages/contact-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipContactHandler extends BaseHandler<ContactMessage> {
  type: ContactMessage["type"] = "contact";

  async send(
    message: ContactMessage,
    channelId: string,
    to: string,
    from?: string
  ): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "whatsapp":
          endpoint = "/whatsapp/1/message/contact";
          payload = {
            from: from || process.env["INFOBIP_WHATSAPP_FROM"],
            to,
            content: {
              contacts: message.contacts,
            },
          };
          break;

        default:
          throw new Error(
            `Unsupported channel for contact message: ${channelId}`
          );
      }

      const response = await this.client.post(endpoint, payload);
      console.log(
        `[${channelId}] Infobip contact message sent successfully:`,
        response.data
      );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip contact message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
