import { BaseChannel } from "../channels/BaseChannel";
import { BaseMessage } from "../types/general";

export abstract class BaseProvider {
  protected channels: Map<string, BaseChannel> = new Map();

  registerChannel(channel: BaseChannel) {
    this.channels.set(channel.id, channel);
  }

  supportsChannel(channelId: string) {
    return this.channels.has(channelId);
  }

  async send(
    channelId: string,
    message: BaseMessage,
    to: string | string[],
    from?: string
  ) {
    const channel = this.channels.get(channelId);
    if (!channel) throw new Error(`Channel ${channelId} not found`);

    const handler = channel.getHandler(message.type);
    if (!handler)
      throw new Error(
        `Message type ${message.type} not supported on ${channelId}`
      );

    return handler.send(message, channelId, to, from);
  }

  abstract id: string;
  abstract providerType: string;
}
