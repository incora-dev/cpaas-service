import {
  CarouselMessage,
} from "../../types/messages/carousel-types";
import { BaseHandler } from "../BaseHandler";

export class InfobipCarouselHandler extends BaseHandler<CarouselMessage> {
  type: CarouselMessage["type"] = "carousel";

  async send(
    message: CarouselMessage,
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
          const cards = message.items.map((item) => ({
            text: item.title,
            mediaUrl: item.mediaUrl,
            buttons: item.buttons,
          }));

          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_VIBER_FROM"],
                destinations: [{ to }],
                content: {
                  text: message.text,
                  type: "CAROUSEL",
                  cards: cards,
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

        case "rcs":
          endpoint = "/rcs/2/messages";
          const rcsCards = message.items.map((item) => ({
            title: item.title,
            description: item.description,
            media: {
              file: {
                url: item.mediaUrl,
              },
              height: item.height,
            },
          }));

          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_RCS_FROM"],
                destinations: [{ to }],
                content: {
                  type: "CAROUSEL",
                  cardWidth: message.cardWidth,
                  contents: rcsCards,
                },
              },
            ],
          };
          break;

        default:
          throw new Error(
            `Unsupported channel for carousel message: ${channelId}`
          );
      }

      const response = await this.client.post(endpoint, payload);
      console.log(
        `[${channelId}] Infobip carousel message sent successfully:`,
        response.data
      );
    } catch (error) {
      console.error(
        `[${channelId}] Error sending Infobip carousel message:`,
        error
      );
      throw error;
    }
  }
}
