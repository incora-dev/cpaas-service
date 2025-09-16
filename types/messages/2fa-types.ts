import { BaseMessage } from "../general";

export interface TwoFAMessage extends BaseMessage {
  type: "2fa";
  placeholders?: {
    [key: string]: string;
  };
}