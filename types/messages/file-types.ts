import { BaseMessage } from "../general";

export interface BaseFileMessage extends BaseMessage {
  type: "file";
  mediaUrl: string;
}

export interface ViberFileMessage extends BaseFileMessage {
  fileName: string;
}

export interface WhatsappFileMessage extends BaseFileMessage {
  filename?: string;
  caption?: string;
}

export type FileMessage = WhatsappFileMessage | ViberFileMessage;
