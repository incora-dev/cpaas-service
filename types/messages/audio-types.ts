import { BaseMessage } from "../general";

export interface AudioMessage extends BaseMessage {
  type: "audio";
  mediaUrl: string;
  text?: string;
}