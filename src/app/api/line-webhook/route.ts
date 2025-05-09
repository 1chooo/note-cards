import type { WebhookEvent, WebhookRequestBody } from "@line/bot-sdk";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import * as line from "@/lib/line";
import { getRandomSpecialProductsMessage } from "@/services/line-bot-services";

export const dynamic = "force-dynamic";

/**
 * Verify the LINE webhook signature
 */
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

async function handleTextMessage(event: WebhookEvent & { type: "message" }) {
  if (event.message.type !== "text") return

  const messageText = event.message.text.toLowerCase()
  const userId = event.source.userId

  if (!userId) {
    console.log("Received message from user with no userId")
    return
  }

  try {
    switch (messageText) {
      case "history": {
        return await getRandomSpecialProductsMessage(event)
      }
      default: {
        const profile = await line.client.getProfile(userId)
        const name = profile.displayName

        await line.client.pushMessage({
          to: userId,
          messages: [
            {
              type: "text",
              text: `Hello ${name}, you said: ${event.message.text}`,
            },
          ],
        })
      }
    }
  } catch (error) {
    console.error(
      {
        message: "Failed to handle text message",
        userId,
        text: event.message.text,
        error,
      },
    )
    throw error
  }
}

async function handleLineEvent(event: WebhookEvent) {
  if (event.mode !== "active") return;

  try {
    switch (event.type) {
      case "message":
        await handleTextMessage(event as WebhookEvent & { type: "message" })
        break
      case "follow": {
        console.log("Follow event:", event);
        break;
      }
      default: {
        console.log("Unhandled event type:", event);
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
