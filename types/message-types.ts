export type MessageType = 'text' | 'image' | 'carousel' | 'video' | 'file' | 'list' | 'audio' | 'sticker' | 'otp';

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

export interface BaseVideoMessage extends BaseMessage {
  type: 'video';
  mediaUrl: string;
  caption?: string;
}

export interface ViberVideoMessage extends BaseVideoMessage {
  thumbnailUrl: string;
  duration: string;
}

export interface WhatsappVideoMessage extends BaseVideoMessage {}

export type VideoMessage = WhatsappVideoMessage | ViberVideoMessage;

export interface BaseFileMessage extends BaseMessage {
  type: 'file';
  mediaUrl: string;
}

export interface ViberFileMessage extends BaseFileMessage {
  fileName: string;
}

export interface WhatsappFileMessage extends BaseFileMessage {}

export type FileMessage = WhatsappFileMessage | ViberFileMessage;

export interface BaseListMessage extends BaseMessage {
  type: 'list';
  text: string;
}

export interface ViberListMessage extends BaseListMessage {
  options: string[];
}

export interface WhatsAppListRow {
  id: string;
  title: string;
  description?: string;
}

export interface WhatsAppListSection {
  title?: string;
  rows: WhatsAppListRow[];
}

export interface WhatsAppListMessage extends BaseListMessage {
  actionTitle: string; // Button name
  sections: WhatsAppListSection[];
  messageId?: string;
}

export type ListMessage = ViberListMessage | WhatsAppListMessage;

export interface AudioMessage extends BaseMessage {
  type: 'audio';
  mediaUrl: string; 
  messageId?: string; 
}

export interface StickerMessage extends BaseMessage {
  type: 'sticker';
  mediaUrl: string;
  messageId?: string;
}

export interface OtpMessage extends BaseMessage {
  type: 'otp';
  templateId: string; 
  parameters: Record<string, string>; 
  language?: string; 
}



