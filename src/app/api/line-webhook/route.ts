import type { WebhookRequestBody } from "@line/bot-sdk";
import { NextRequest, NextResponse } from "next/server";

import * as line from "@/lib/line";
import { getRandomSpecialProductsMessage } from "@/services/line-bot-services";

// This is needed because we're handling the raw request body ourselves
export const dynamic = "force-dynamic";

// Middleware function adapted for App Router
async function runMiddleware(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature") || "";

  // Create a mock request and response for the LINE middleware
  const mockReq = {
    body: JSON.parse(rawBody),
    headers: {
      "x-line-signature": signature,
    },
    rawBody: Buffer.from(rawBody),
  };

  const mockRes = {
    status: () => mockRes,
    send: () => mockRes,
    end: () => {},
  };

  return new Promise<WebhookRequestBody>((resolve, reject) => {
    line.middleware(mockReq, mockRes, (result) => {
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(mockReq.body);
      }
    });
  });
}

async function handleLineEvent(event: WebhookRequestBody["events"][number]) {
  if (event.mode !== "active") return;

  try {
    switch (event.type) {
      case "message": {
        if (event.message.type === "text") {
          const messageText = event.message.text;
          switch (messageText.toLowerCase()) {
            case "history": {
              return getRandomSpecialProductsMessage(event);
            }
            default: {
              const userId = event.source.userId;
              const name = userId
                ? (await line.client.getProfile(userId)).displayName
                : "User";

              await line.client.replyMessage(event.replyToken, {
                type: "text",
                text: `Hi, ${name}!`,
              });
              break;
            }
          }
        }
        break;
      }
      case "follow": {
        // Handle follow event here
        break;
      }
      default: {
        console.log("Unhandled event type:", event.type);
        break;
      }
    }
  } catch (err) {
    console.error("Error handling event:", err, "Event:", event);
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Process the webhook with LINE middleware
    const body = await runMiddleware(req);

    // Handle all events
    await Promise.all(body.events.map(handleLineEvent));

    // Return success response
    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("Error in handler:", err);

    if (err instanceof Error) {
      return NextResponse.json(
        { name: err.name, message: err.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
