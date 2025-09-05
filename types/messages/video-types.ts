import { BaseMessage } from "../general";

export interface VideoMessage extends BaseMessage {
  type: "video";
  mediaUrl: string;
  caption: string;
  thumbnailUrl: string;
  duration: string;
}