import { BaseMessage } from "../general";
import { MessageBtn } from "../general";

export interface FileMessage extends BaseMessage {
  type: "file";
  mediaUrl: string;
  filename: string;
  caption?: string;
  buttons?: MessageBtn[];
}
