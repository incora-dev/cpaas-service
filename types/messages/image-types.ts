import { BaseMessage } from "../general";

export interface ImageMessage extends BaseMessage {
  type: "image";
  mediaUrl: string;
  caption?: string;
}
