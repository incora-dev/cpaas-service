import { BaseMessage } from "../general";

export interface StickerMessage extends BaseMessage {
  type: "sticker";
  mediaUrl: string;
}
