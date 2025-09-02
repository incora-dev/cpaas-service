import { BaseMessage } from "../general";

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