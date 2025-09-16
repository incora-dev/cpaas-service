import { BaseMessage } from "../general";

export interface ListSection {
  sectionTitle: string; 
  items: ListItem[]; 
}

export interface ListItem {
  id: string; 
  text: string; 
  description?: string; 
}

export interface ListMessage extends BaseMessage {
  type: "list";
  text: string;
  actionTitle?: string;
  sections: ListSection[];
}
