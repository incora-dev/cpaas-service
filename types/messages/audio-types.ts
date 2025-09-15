import { BaseMessage } from "../general";
import { MessageBtn } from "../general";

export interface AudioMessage extends BaseMessage {
  type: "audio";
  mediaUrl: string;
  text?: string;
  buttons?: MessageBtn[];
}