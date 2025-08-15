import { BaseProvider } from './BaseProvider';
import { InfobipViberChannel, InfobipSmsChannel, InfobipWhatsappChannel } from '../channels/infobip';

export interface InfobipConfig {
  baseUrl: string;
  apiKey: string;
}

export class InfobipProvider extends BaseProvider {
  id = 'infobip';
  providerType = 'infobip';

  constructor(config: InfobipConfig) {
    super();
    this.registerChannel(new InfobipViberChannel(config));
    this.registerChannel(new InfobipSmsChannel(config));
    this.registerChannel(new InfobipWhatsappChannel(config));
  }
}
