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

export interface WhatsappVideoContent extends BaseVideoContent {}

export type VideoContent = WhatsappVideoContent | ViberVideoContent;

export interface BaseFileContent extends BaseMessageContent {
  type: 'file';
  mediaUrl: string;
}

export interface ViberFileContent extends BaseFileContent {
  fileName: string;
}

export interface WhatsappFileContent extends BaseFileContent {}

export type FileContent = WhatsappFileContent | ViberFileContent;

export interface BaseListContent extends BaseMessageContent {
  type: 'list';
  text: string;
}

export interface ViberListContent extends BaseListContent {
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
}

export type ListContent = ViberListContent | WhatsAppListContent;

export interface AudioContent extends BaseMessageContent {
  type: 'audio';
  mediaUrl: string;
}

export interface StickerContent extends BaseMessageContent {
  type: 'sticker';
  mediaUrl: string;
}

export interface OtpContent extends BaseMessageContent {
  type: "otp";
  templateId: string;
  parameters: Record<string, string>;
  language?: string;
}

export interface LocationContent extends BaseMessageContent {
  type: "location";
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
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
  | AudioContent
  | OtpContent
  | LocationContent;

export interface UnifiedMessage {
  provider: MessageProvider;
  to: string;
  from?: string;
  subject?: string;
  contents: MessageContent[];
}
