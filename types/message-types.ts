export type MessageType = 'text' | 'image' | 'carousel' | 'video' | 'file' | 'list';

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

export interface BaseVideoMessage {
  type: 'video';
  mediaUrl: string;
  caption?: string;
}

export interface ViberVideoMessage extends BaseVideoMessage {
  thumbnailUrl: string;
  duration: string;
}

export type VideoMessage = BaseVideoMessage | ViberVideoMessage;

export interface BaseFileMessage {
  type: 'file';
  mediaUrl: string;
}

export interface ViberFileMessage extends BaseFileMessage {
  fileName: string;
}

export type FileMessage = BaseFileMessage | ViberFileMessage;

export interface ListMessage {
  type: 'list';
  text: string;        
  options: string[];
}

