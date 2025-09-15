import { BaseMessage } from "../general";
import { Button } from "../general";
import { MessageBtn } from "../general";

export interface TextMessage extends BaseMessage {
  type: "text";
  text: string;
  button?: Button;
  buttons?: MessageBtn[];
}
