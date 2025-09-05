import { BaseMessage } from "../general";

export interface FileMessage extends BaseMessage {
  type: "file";
  mediaUrl: string;
  filename: string;
}
