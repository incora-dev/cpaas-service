import { BaseMessage } from "../general";

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
