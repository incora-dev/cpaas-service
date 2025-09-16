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
      let endpoint: string;
      let payload: any;

      switch (channelId) {
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
                    type: "LOCATION",
                    latitude: message.latitude,
                    longitude: message.longitude,
                    name: message.name,
                    address: message.address,
                  },
                },
              },
            ],
          };
          break;
        }

        case "viber": {
          endpoint = "/messages-api/1/messages";

          payload = {
            messages: [
              {
                channel: "VIBER_BM",
                sender: from || process.env["INFOBIP_VIBER_FROM"],
                destinations: recipients.map((r) => ({ to: r })),
                content: {
                  body: {
                    type: "LOCATION",
                    latitude: message.latitude,
                    longitude: message.longitude,
                    name: message.name,
                    address: message.address,
                  },
                },
              },
            ],
          };
          break;
        }

        default:
          throw new Error(
            `Unsupported channel for location message: ${channelId}`
          );
      }

       const response = await this.client.post(endpoint, payload);
       console.log(
         `[${channelId}] Infobip location message sent successfully:`,
         response.data
       );
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip location message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
