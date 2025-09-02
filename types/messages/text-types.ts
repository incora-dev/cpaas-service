import { BaseMessage } from "../general";

export interface TextMessage extends BaseMessage {
  type: "text";
  text: string;
}
