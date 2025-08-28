import { BaseChannel } from '../BaseChannel';
import { InfobipTextHandler, InfobipImageHandler, InfobipVideoHandler, InfobipFileHandler } from '../../handlers/infobip';

export class InfobipWhatsappChannel extends BaseChannel {
  id = 'whatsapp';
  providerId = 'infobip';

  constructor(config: { baseUrl: string; apiKey: string }) {
    super();
    this.registerHandler(new InfobipTextHandler(config));
    this.registerHandler(new InfobipImageHandler(config));
    this.registerHandler(new InfobipVideoHandler(config));
    this.registerHandler(new InfobipFileHandler(config));
  }
}
