import { BaseMessage } from '../types/message-types';

export abstract class BaseHandler<T extends BaseMessage = BaseMessage> {
  abstract type: T['type'];
  abstract send(message: T, channelId: string, to: string, from?: string): Promise<void>;
}
