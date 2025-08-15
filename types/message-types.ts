export type MessageType = 'text' | 'image' | 'carousel';

export interface Button {
  title: string;
  action: string;
}

export interface BaseMessage {
  type: MessageType;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  text: string;
}

export interface ImageMessage extends BaseMessage {
  type: 'image';
  mediaUrl: string;
  caption?: string;
}

export interface CarouselItem {
  title: string;
  description: string;
  mediaUrl: string;
  buttons: Button[];
}

export interface CarouselMessage extends BaseMessage {
  type: 'carousel';
  items: CarouselItem[];
}
