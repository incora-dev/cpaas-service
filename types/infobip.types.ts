export interface InfobipConfig {
  baseUrl: string;
  apiKey: string;
}

export type MessageProvider = 'sms' | 'whatsapp' | 'email' | 'rcs' | 'viber';

export interface BaseMessageContent {
  type: string;
}

export interface TextContent extends BaseMessageContent {
  type: 'text';
  text: string;
}

export interface ImageContent extends BaseMessageContent {
  type: 'image';
  mediaUrl: string;
  caption?: string;
}

export interface TemplateContent extends BaseMessageContent {
  type: 'template';
  templateName: string;
  language: string;
  variables?: Record<string, string>;
}

export interface CardContent extends BaseMessageContent {
  type: 'card';
  title: string;
  description: string;
  mediaUrl?: string;
  suggestions?: string[];
}

export interface CarouselContent extends BaseMessageContent {
  type: 'carousel';
  cards: Array<{
    title: string;
    description: string;
    mediaUrl?: string;
    suggestions?: string[];
  }>;
}

export interface BaseVideoContent extends BaseMessageContent {
  type: 'video';
  mediaUrl: string;
  caption?: string;
}

export interface ViberVideoContent extends BaseVideoContent {
  thumbnailUrl: string;
  duration: string;
}

export type VideoContent = BaseVideoContent | ViberVideoContent;

export interface BaseFileContent extends BaseMessageContent {
  type: 'file';
  mediaUrl: string;
}

export interface ViberFileContent extends BaseFileContent {
  fileName: string;
}

export type FileContent = BaseFileContent | ViberFileContent;

export interface BaseListContent extends BaseMessageContent {
  type: 'list';
  text: string;
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

export interface WhatsAppListContent extends BaseListContent {
  actionTitle: string;
  sections: WhatsAppListSection[];
  messageId?: string;
}

export type ListContent = BaseListContent | WhatsAppListContent;

export interface AudioContent extends BaseMessageContent {
  type: 'audio';
  mediaUrl: string;
  messageId?: string;
}

export interface StickerContent extends BaseMessageContent {
  type: 'sticker';
  mediaUrl: string;
  messageId?: string;
}

export type MessageContent =
  | TextContent
  | ImageContent
  | TemplateContent
  | CardContent
  | CarouselContent
  | VideoContent
  | FileContent
  | ListContent
  | AudioContent;

export interface UnifiedMessage {
  provider: MessageProvider;
  to: string;
  from?: string;
  subject?: string;
  contents: MessageContent[];
}
