import type { WebhookEvent, WebhookRequestBody } from "@line/bot-sdk";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import * as line from "@/lib/line";
import { getRandomSpecialProductsMessage } from "@/services/line-bot-services";

// This is needed because we're handling the raw request body ourselves
export const dynamic = "force-dynamic";

// Verify LINE signature directly instead of using middleware
async function verifySignature(
  req: NextRequest,
  channelSecret: string
): Promise<WebhookRequestBody> {
  const signature = req.headers.get("x-line-signature");
  if (!signature) {
    throw new Error("No signature found in request headers");
  }

  const rawBody = await req.text();

  // Create HMAC with SHA256
  const hmac = crypto.createHmac("sha256", channelSecret);
  hmac.update(rawBody);
  const calculatedSignature = hmac.digest("base64");

  // Compare signatures
  if (signature !== calculatedSignature) {
    throw new Error("Invalid signature");
  }

  // Parse and return the body
  return JSON.parse(rawBody);
}

async function handleLineEvent(event: WebhookEvent) {
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

              await line.client.pushMessage({
                to: userId ?? "",
                messages: [
                  {
                    type: "text",
                    text: `Hello ${name}, you said: ${messageText}`,
                  },
                ],
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
    // Get the channel secret from the LINE client configuration
    const channelSecret = line.clientConfig.channelSecret;

    if (!channelSecret) {
      throw new Error("LINE channel secret is not configured");
    }

    // Verify signature and get the body
    const body = await verifySignature(req, channelSecret);

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
