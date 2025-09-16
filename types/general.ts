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
  | "card"
  | "2fa";

export type BtnType = "REPLY" | "OPEN_URL"

export interface Button {
  title: string;
  action: string;
}

export interface BaseMessage {
  type: MessageType;
}
