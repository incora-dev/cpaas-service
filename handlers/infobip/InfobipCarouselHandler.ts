import {
  CarouselMessage,
  ViberCarouselMessage,
  RcsCarouselMessage,
} from "../../types/message-types";
import { BaseHandler } from '../BaseHandler';

export class InfobipCarouselHandler extends BaseHandler<CarouselMessage> {
  type: CarouselMessage['type'] = 'carousel';

  async send(message: CarouselMessage, channelId: string, to: string, from?: string): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case "viber":
          endpoint = "/viber/2/messages";
          const viberMessage = message as ViberCarouselMessage;
          const cards = viberMessage.items.map((item) => ({
            text: item.title,
            mediaUrl: item.mediaUrl,
            description: item.description,
            buttons: item.buttons,
          }));

          payload = {
            messages: [
              {
                sender: from || process.env["INFOBIP_VIBER_FROM"],
                destinations: [{ to }],
                content: {
                  text: "Check out these options:",
                  type: "CAROUSEL",
                  cards,
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
          const rcsMessage = message as RcsCarouselMessage;
          const rcsCards = rcsMessage.items.map((item) => ({
            title: item.title,
            description: item.description,
            media: {
              file: {
                url: item.mediaUrl,
              },
              thumbnail: { url: item.thumbnailUrl },
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
                  cardWidth: rcsMessage.cardWidth,
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
      console.log(`[${channelId}] Infobip carousel message sent successfully:`, response.data);
    } catch (error) {
      console.error(`[${channelId}] Error sending Infobip carousel message:`, error);
      throw error;
    }
  }
}
