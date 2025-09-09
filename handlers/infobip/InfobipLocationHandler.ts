import { LocationMessage } from "../../types/messages/location-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipLocationHandler extends BaseHandler<LocationMessage> {
  type: LocationMessage["type"] = "location";

  async send(
    message: LocationMessage,
    channelId: string,
    to: string | string[],
    from?: string
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];

      switch (channelId) {
        case "whatsapp": {
          const endpoint = "/whatsapp/1/message/location";

          for (const recipient of recipients) {
            const payload = {
              from: from || process.env["INFOBIP_WHATSAPP_FROM"],
              to: recipient,
              content: {
                latitude: message.latitude,
                longitude: message.longitude,
                name: message.name,
                address: message.address,
              },
            };

            const response = await this.client.post(endpoint, payload);
            console.log(
              `[whatsapp] Infobip location message sent successfully to ${recipient}:`,
              response.data
            );
          }
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for location message: ${channelId}`
          );
      }
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip location message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
