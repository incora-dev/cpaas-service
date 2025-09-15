import { BaseMessage } from "../general";
import { Button } from "../general";
import { MessageBtn } from "../general";

export interface ImageMessage extends BaseMessage {
  type: "image";
  mediaUrl: string;
  caption?: string;
  button?: Button;
  buttons?: MessageBtn[];
}
