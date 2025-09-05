import { BaseMessage } from "../general";

export interface ListMessage extends BaseMessage {
  type: "list";
  text: string;
  actionTitle: string;
  options: string[];
}
