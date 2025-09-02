import { BaseChannel } from '../BaseChannel';
import {
  InfobipTextHandler,
  InfobipImageHandler,
  InfobipCarouselHandler,
  InfobipVideoHandler,
  InfobipFileHandler,
  InfobipCardHandler,
  InfobipAudioHandler
} from "../../handlers/infobip";
export class InfobipRcsChannel extends BaseChannel {
  id = 'rcs';
  providerId = 'infobip';

  constructor(config: { baseUrl: string; apiKey: string }) {
    super();
    this.registerHandler(new InfobipTextHandler(config));
    this.registerHandler(new InfobipImageHandler(config));
    this.registerHandler(new InfobipCarouselHandler(config));
    this.registerHandler(new InfobipVideoHandler(config));
    this.registerHandler(new InfobipFileHandler(config));
    this.registerHandler(new InfobipCardHandler(config));
    this.registerHandler(new InfobipAudioHandler(config));
  }
}
