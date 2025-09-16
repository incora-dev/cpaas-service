import { OtpMessage } from "../../types/messages/otp-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipOtpHandler extends BaseHandler<OtpMessage> {
  type: OtpMessage["type"] = "otp";

  async send(
    message: OtpMessage,
    channelId: string,
    to: string | string[],
    from?: string
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];
      let endpoint: string;
      let payload: any;

        switch (channelId) {
          case "viber":
            endpoint = "/viber/2/messages";
            payload = {
              messages: [
                {
                  sender: from || process.env["INFOBIP_VIBER_FROM"],
                  destinations: recipients.map((r) => ({ to: r })),
                  content: {
                    type: "OTP_TEMPLATE",
                    id: message.templateId,
                    parameters: message.parameters,
                    language: message.language,
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
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip otp message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
