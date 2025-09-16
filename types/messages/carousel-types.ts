import { BaseMessage, Button } from "../general";

export interface CarouselItem {
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  buttons: Button[];
  height: "SHORT" | "MEDIUM" | "TALL";
}

export interface CarouselMessage extends BaseMessage {
  type: "carousel";
  text: string;
  items: CarouselItem[];
  cardWidth: "SMALL" | "MEDIUM";
}
