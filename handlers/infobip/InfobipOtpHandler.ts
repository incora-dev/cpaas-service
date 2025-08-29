import { OtpMessage } from "../../types/message-types";
import { BaseHandler } from "../BaseHandler";
import axios, { AxiosInstance } from "axios";

export class InfobipOtpHandler extends BaseHandler<OtpMessage> {
  type: OtpMessage["type"] = "otp";
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
    message: OtpMessage,
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
               sender:
                 from || process.env["INFOBIP_VIBER_FROM"] || "IBSelfServe",
               destinations: [{ to }],
               content: {
                 type: "OTP_TEMPLATE",
                 id: message.templateId,
                 parameters: message.parameters,
                 language: message.language || "ENGLISH",
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

        default:
          throw new Error(
            `Unsupported channel for otp message: ${channelId}`
          );
      }

      const response = await this.client.post(endpoint, payload);
      console.log(
        `[${channelId}] Infobip otp message sent successfully:`,
        response.data
      );
    } catch (error) {
      console.error(
        `[${channelId}] Error sending Infobip otp message:`,
        error
      );
      throw error;
    }
  }
}
