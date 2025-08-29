import { BaseChannel } from '../BaseChannel';
import {
  InfobipTextHandler,
  InfobipImageHandler,
  InfobipVideoHandler,
  InfobipFileHandler,
  InfobipListHandler,
  InfobipAudioHandler,
  InfobipStickerHandler,
  InfobipLocationHandler,
} from "../../handlers/infobip";

export class InfobipWhatsappChannel extends BaseChannel {
  id = 'whatsapp';
  providerId = 'infobip';

  constructor(config: { baseUrl: string; apiKey: string }) {
    super();
    this.registerHandler(new InfobipTextHandler(config));
    this.registerHandler(new InfobipImageHandler(config));
    this.registerHandler(new InfobipVideoHandler(config));
    this.registerHandler(new InfobipFileHandler(config));
    this.registerHandler(new InfobipListHandler(config));
    this.registerHandler(new InfobipAudioHandler(config));
    this.registerHandler(new InfobipStickerHandler(config));
    this.registerHandler(new InfobipLocationHandler(config));
  }
}
