import { BaseChannel } from '../BaseChannel';
import { InfobipTextHandler, InfobipImageHandler, InfobipCarouselHandler } from '../../handlers/infobip';

export class InfobipViberChannel extends BaseChannel {
  id = 'viber';
  providerId = 'infobip';

  constructor(config: { baseUrl: string; apiKey: string }) {
    super();
    this.registerHandler(new InfobipTextHandler(config));
    this.registerHandler(new InfobipImageHandler(config));
    this.registerHandler(new InfobipCarouselHandler(config));
  }
}
