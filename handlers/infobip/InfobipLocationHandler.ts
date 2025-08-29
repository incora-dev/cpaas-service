import { LocationMessage } from "../../types/message-types";
import { BaseHandler } from "../BaseHandler";
import axios, { AxiosInstance } from "axios";

export class InfobipLocationHandler extends BaseHandler<LocationMessage> {
  type: LocationMessage["type"] = "location";
  private client: AxiosInstance;

  constructor(config: { baseUrl: string; apiKey: string }) {
    super();
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `App ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async send(
    message: LocationMessage,
    channelId: string,
    to: string,
    from?: string
  ): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "whatsapp":
          endpoint = "/whatsapp/1/message/location";
          payload = {
            from:
              from || process.env["INFOBIP_WHATSAPP_FROM"] || "447860088970",
            to,
            content: {
              latitude: message.latitude,
              longitude: message.longitude,
              name: message.name,
              address: message.address,
            },
            callbackData: "Callback data",
            notifyUrl: "https://www.example.com/whatsapp",
          };
          break;

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
        error
      );
      throw error;
    }
  }
}
