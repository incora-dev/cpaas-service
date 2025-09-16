import { BaseMessage } from "../general";
import { Button } from "../general";

export interface VideoMessage extends BaseMessage {
  type: "video";
  mediaUrl: string;
  caption: string;
  thumbnailUrl: string;
  duration: string;
  button?: Button;
}