import { ViberVideoMessage, VideoMessage } from '../../types/message-types';
import { BaseHandler } from '../BaseHandler';

export class InfobipVideoHandler extends BaseHandler<VideoMessage> {
  type: VideoMessage['type'] = 'video';

  async send(message: VideoMessage, channelId: string, to: string, from?: string): Promise<void> {
    try {
      let endpoint: string;
      let payload: any;

      switch (channelId) {
        case 'whatsapp':
          endpoint = '/whatsapp/1/message/video';
          payload = {
            from: from || process.env['INFOBIP_WHATSAPP_FROM'],
            to,
            content: {
              mediaUrl: message.mediaUrl,
              caption: message.caption,
            }
          };
          break;

        case 'viber':
          endpoint = '/viber/2/messages';
          const viberMessage = message as ViberVideoMessage;
          payload = {
            messages: [
              {
                sender: from || process.env['INFOBIP_VIBER_FROM'],
                destinations: [{ to }],
                content: {
                  mediaUrl: viberMessage.mediaUrl,
                  text: viberMessage.caption,
                  type: 'VIDEO',
                  mediaDuration: viberMessage.duration,
                  thumbnailUrl: viberMessage.thumbnailUrl
                },
                options: {
                  label: 'TRANSACTIONAL',
                  applySessionRate: false,
                  toPrimaryDeviceOnly: false
                }
              }
            ]
          };
          break;

        default:
          throw new Error(`Unsupported channel for video message: ${channelId}`);
      }

      const response = await this.client.post(endpoint, payload);
      console.log(`[${channelId}] Infobip video message sent successfully:`, response.data);
    } catch (error: any) {
      console.error(`[${channelId}] Error sending Infobip video message:`, error);
      throw error;
    }
  }
}
