import { BaseChannel } from '../BaseChannel';
import {
  InfobipTextHandler,
  InfobipImageHandler,
  InfobipCarouselHandler,
  InfobipVideoHandler,
  InfobipFileHandler,
  InfobipListHandler,
  InfobipLocationHandler,
  InfobipOtpHandler,
} from "../../handlers/infobip";
export class InfobipViberChannel extends BaseChannel {
  id = 'viber';
  providerId = 'infobip';

  constructor(config: { baseUrl: string; apiKey: string }) {
    super();
    this.registerHandler(new InfobipTextHandler(config));
    this.registerHandler(new InfobipImageHandler(config));
    this.registerHandler(new InfobipCarouselHandler(config));
    this.registerHandler(new InfobipVideoHandler(config));
    this.registerHandler(new InfobipFileHandler(config));
    this.registerHandler(new InfobipListHandler(config));
    this.registerHandler(new InfobipLocationHandler(config));
    this.registerHandler(new InfobipOtpHandler(config));
  }
}
