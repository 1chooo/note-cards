import {
  ClientConfig,
  MiddlewareConfig,
  middleware as lineMiddleware,
} from "@line/bot-sdk";
import { messagingApi } from "@line/bot-sdk";

import { LINE_CONFIG } from "@/constants/line";

const { MessagingApiClient } = messagingApi;

export const clientConfig: ClientConfig = {
  channelAccessToken: LINE_CONFIG.channelAccessToken || "",
  channelSecret: LINE_CONFIG.channelSecret,
};

export const client = new MessagingApiClient({
  channelAccessToken: LINE_CONFIG.channelAccessToken || "",
});

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: LINE_CONFIG.channelAccessToken,
  channelSecret: LINE_CONFIG.channelSecret || "",
};

export const middleware = lineMiddleware(middlewareConfig);
