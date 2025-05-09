import {
  ClientConfig,
  MiddlewareConfig,
  middleware as lineMiddleware,
} from "@line/bot-sdk";
import { messagingApi } from "@line/bot-sdk";

const { MessagingApiClient } = messagingApi;

// Setup all LINE client and Express configurations.
export const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.CHANNEL_SECRET,
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || "",
};

// export const client = new Client(clientConfig);
export const client = new MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
});
export const middleware = lineMiddleware(middlewareConfig);
