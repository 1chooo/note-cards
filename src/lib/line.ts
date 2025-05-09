import {
  ClientConfig,
  MiddlewareConfig,
  middleware as lineMiddleware,
} from "@line/bot-sdk";
import { messagingApi } from "@line/bot-sdk";

const { MessagingApiClient } = messagingApi;

export const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.CHANNEL_SECRET,
};

export const client = new MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
});

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || "",
};

export const middleware = lineMiddleware(middlewareConfig);
