import type { WebhookRequestBody } from "@line/bot-sdk"
import type {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse
} from "next"

import * as line from "@/lib/line"
import {
  getRandomSpecialProductsMessage
} from "@/services/line-bot-services"

export const config = {
  api: {
    bodyParser: false,
  },
}

function runMiddleware(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    line.middleware(req, res, (result) => {
      if (result instanceof Error) {
        reject(result)
      } else {
        resolve()
      }
    })
  })
}

async function handleLineEvent(event: WebhookRequestBody["events"][number]) {
  if (event.mode !== "active") return

  try {
    switch (event.type) {
      case "message": {
        if (event.message.type === "text") {
          const messageText = event.message.text
          switch (messageText.toLowerCase()) {
            case "history": {
              return getRandomSpecialProductsMessage(event)
            }
            default: {
              const userId = event.source.userId
              const name = userId ? (await line.client.getProfile(userId)).displayName : "User"

              await line.client.replyMessage(event.replyToken, {
                type: "text",
                text: `Hi, ${name}!`,
              })
              break
            }
          }
        }
        break
      }
      case "follow": {
        // Handle follow event here
        break
      }
      default: {
        console.log("Unhandled event type:", event.type)
        break
      }
    }
  } catch (err) {
    console.error("Error handling event:", err, "Event:", event)
    throw err
  }
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end() // Method Not Allowed
  }

  try {
    await runMiddleware(req, res)

    const body: WebhookRequestBody = req.body
    await Promise.all(body.events.map(handleLineEvent))

    res.status(200).end()
  } catch (err) {
    console.error("Error in handler:", err)

    if (err instanceof Error) {
      res.status(500).json({ name: err.name, message: err.message })
    } else {
      res.status(500).json({ message: "Unknown error occurred" })
    }
  }
}

export default handler
