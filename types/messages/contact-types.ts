import { BaseMessage } from "../general";

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
}