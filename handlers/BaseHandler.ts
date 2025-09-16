import { BaseMessage } from "../types/general";
import axios, { AxiosInstance } from "axios";

export abstract class BaseHandler<T extends BaseMessage = BaseMessage> {
  abstract type: T["type"];
  protected client: AxiosInstance;

  constructor(config: { baseUrl: string; apiKey: string }) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `App ${config.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  abstract send(
    message: T,
    channelId: string,
    to: string | string[],
    from?: string
  ): Promise<void>;
}
