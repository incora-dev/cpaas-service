import { BaseMessage } from "../general";

export interface LocationMessage extends BaseMessage {
  type: "location";
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}