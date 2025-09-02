export interface InfobipConfig {
  baseUrl: string;
  apiKey: string;
}

export type MessageProvider = "sms" | "whatsapp" | "rcs" | "viber";

export type MessageType =
  | "text"
  | "image"
  | "carousel"
  | "video"
  | "file"
  | "list"
  | "audio"
  | "sticker"
  | "otp"
  | "location"
  | "contact"
  | "card";

export interface Button {
  title: string;
  action: string;
}

export interface BaseMessage {
  type: MessageType;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  text: string;
}

export interface ImageMessage extends BaseMessage {
  type: "image";
  mediaUrl: string;
  caption?: string;
}

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

export interface BaseVideoMessage extends BaseMessage {
  type: "video";
  mediaUrl: string;
  caption?: string;
}

export interface ViberVideoMessage extends BaseVideoMessage {
  thumbnailUrl: string;
  duration: string;
}

export interface WhatsappVideoMessage extends BaseVideoMessage {}

export interface RcsVideoMessage extends BaseVideoMessage {
  thumbnailUrl?: string;
}

export type VideoMessage =
  | WhatsappVideoMessage
  | ViberVideoMessage
  | RcsVideoMessage;

export interface BaseFileMessage extends BaseMessage {
  type: "file";
  mediaUrl: string;
}

export interface ViberFileMessage extends BaseFileMessage {
  fileName: string;
}

export interface WhatsappFileMessage extends BaseFileMessage {
  filename?: string;
  caption?: string;
}

export type FileMessage = WhatsappFileMessage | ViberFileMessage;

export interface BaseListMessage extends BaseMessage {
  type: "list";
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
}

export type ListMessage = ViberListMessage | WhatsAppListMessage;

export interface AudioMessage extends BaseMessage {
  type: "audio";
  mediaUrl: string;
}

export interface StickerMessage extends BaseMessage {
  type: "sticker";
  mediaUrl: string;
}

export interface OtpMessage extends BaseMessage {
  type: "otp";
  templateId: string;
  parameters: Record<string, string>;
  language?:
    | "ENGLISH"
    | "ARABIC"
    | "BULGARIAN"
    | "CROATIAN"
    | "CZECH"
    | "DANISH"
    | "GERMAN"
    | "GREEK"
    | "SPANISH"
    | "FINNISH"
    | "FRENCH"
    | "HEBREW"
    | "BURMESE"
    | "HUNGARIAN"
    | "INDONESIAN"
    | "ITALIAN"
    | "JAPANESE"
    | "NORWEGIAN"
    | "DUTCH"
    | "POLISH"
    | "PORTUGUESE_PORTUGAL"
    | "PORTUGUESE_BRAZIL"
    | "ROMANIAN"
    | "RUSSIAN"
    | "SLOVAK"
    | "SERBIAN"
    | "SWEDISH"
    | "THAI"
    | "TURKISH"
    | "UKRAINIAN"
    | "VIETNAMESE"
    | "PERSIAN"
    | "BELARUSIAN";
}

export interface LocationMessage extends BaseMessage {
  type: "location";
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface ContactAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  countryCode?: string;
  type?: "HOME" | "WORK";
}

export interface ContactEmail {
  email: string;
  type?: "HOME" | "WORK";
}

export interface ContactName {
  firstName: string;
  formattedName: string;
  lastName?: string;
  middleName?: string;
  nameSuffix?: string;
  namePrefix?: string;
}

export interface ContactOrg {
  company?: string;
  department?: string;
  title?: string;
}

export interface ContactPhone {
  phone: string;
  type?: "CELL" | "MAIN" | "IPHONE" | "HOME" | "WORK";
  waId?: string;
}

export interface ContactUrl {
  url: string;
  type?: "HOME" | "WORK";
}

export interface Contact {
  addresses?: ContactAddress[];
  birthday?: string; // YYYY-MM-DD
  emails?: ContactEmail[];
  name: ContactName;
  org?: ContactOrg;
  phones?: ContactPhone[];
  urls?: ContactUrl[];
}

export interface ContactMessage extends BaseMessage {
  type: "contact";
  contacts: Contact[];
  callbackData?: string;
  notifyUrl?: string;
  entityId?: string;
  applicationId?: string;
}

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
