import { BaseMessage } from "../general";

export interface BaseVideoMessage extends BaseMessage {
  type: "video";
  mediaUrl: string;
  caption?: string;
}

export interface ViberVideoMessage extends BaseVideoMessage {
  thumbnailUrl: string;
  duration: string;
}

export interface WhatsappVideoMessage extends BaseVideoMessage {}

export interface RcsVideoMessage extends BaseVideoMessage {
  thumbnailUrl?: string;
}

export type VideoMessage =
  | WhatsappVideoMessage
  | ViberVideoMessage
  | RcsVideoMessage;