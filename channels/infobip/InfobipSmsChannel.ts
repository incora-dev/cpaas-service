import { BaseChannel } from '../BaseChannel';
import { InfobipTextHandler } from '../../handlers/infobip';

export class InfobipSmsChannel extends BaseChannel {
  id = 'sms';
  providerId = 'infobip';

  constructor(config: { baseUrl: string; apiKey: string }) {
    super();
    this.registerHandler(new InfobipTextHandler(config));
  }
}
