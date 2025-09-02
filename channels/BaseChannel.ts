import { BaseHandler } from "../handlers/BaseHandler";
import { BaseMessage } from "../types/general";

export abstract class BaseChannel {
  protected handlers: Map<BaseMessage["type"], BaseHandler<any>> = new Map();

  registerHandler(handler: BaseHandler) {
    this.handlers.set(handler.type, handler);
  }

  getHandler(type: BaseMessage["type"]) {
    return this.handlers.get(type);
  }

  abstract id: string;
  abstract providerId: string;
}
