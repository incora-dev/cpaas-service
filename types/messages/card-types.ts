import { BaseMessage } from "../general";

export interface CardMessage extends BaseMessage {
  type: "card";
  orientation: "HORIZONTAL" | "VERTICAL";
  alignment: "LEFT" | "RIGHT";
  title?: string;
  description?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  height: "SHORT" | "MEDIUM" | "TALL";
}