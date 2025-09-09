import { TwoFAMessage } from "../../types/messages/2fa-types";
import { BaseHandler } from "../BaseHandler";

export class Infobip2FAHandler extends BaseHandler<TwoFAMessage> {
  type: TwoFAMessage["type"] = "2fa";

  async send(
    message: TwoFAMessage,
    channelId: string,
    to: string | string[],
    from?: string
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];

      for (const recipient of recipients) {
        let endpoint: string;
        let payload: any;

        switch (channelId) {
          case "sms":
            endpoint = "/2fa/2/pin";
            payload = {
              from: from || process.env["INFOBIP_SMS_FROM"],
              applicationId: process.env["APPLICATION_ID"],
              messageId: process.env["MESSAGE_ID"],
              to: recipient,
              placeholders: message.placeholders,
            };
            break;

          default:
            throw new Error(
              `Unsupported channel for 2FA message: ${channelId}`
            );
        }

        const response = await this.client.post(endpoint, payload);
        console.log(
          `[${channelId}] Infobip 2FA message sent successfully to ${recipient}:`,
          response.data
        );
      }
    } catch (error: any) {
      console.error(
        `[${channelId}] Error sending Infobip 2FA message:`,
        error.response?.data || error
      );
      throw error;
    }
  }
}
