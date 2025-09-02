import { BaseMessage, Button } from "../general";

export interface BaseCarouselItem {
  title: string;
  description: string;
  mediaUrl: string;
}

export interface BaseCarouselMessage extends BaseMessage {
  type: "carousel";
  items: BaseCarouselItem[];
}

export interface ViberCarouselItem extends BaseCarouselItem {
  buttons: Button[];
}

export interface ViberCarouselMessage extends BaseCarouselMessage {
  items: ViberCarouselItem[];
}

export interface RcsCarouselItem extends BaseCarouselItem {
  height: "SHORT" | "MEDIUM" | "TALL";
  thumbnailUrl?: string;
}

export interface RcsCarouselMessage extends BaseCarouselMessage {
  items: RcsCarouselItem[];
  cardWidth: "SMALL" | "MEDIUM";
}

export type CarouselMessage = ViberCarouselMessage | RcsCarouselMessage;
