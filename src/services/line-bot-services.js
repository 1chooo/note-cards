import { Client, middleware } from "@line/bot-sdk";

import { LINE_CONFIG } from "@/constants/line";
import { MOCK_SPECIAL_PRODUCTS_DATA } from "@/constants/products";

// client 主要是用來對 LINE Bot 進行操作。ex. 回覆、廣播
export const client = new Client(LINE_CONFIG);

// middleware 是來驗證 webhook 回傳時的 x-line-signature 是否合法。
export const lineMiddleware = middleware(LINE_CONFIG);

export const getRandomSpecialProductsMessage = async (event) => {
  const randomProduct =
    MOCK_SPECIAL_PRODUCTS_DATA[
      Math.floor(Math.random() * MOCK_SPECIAL_PRODUCTS_DATA.length)
    ];
  return client.replyMessage(event.replyToken, [
    {
      type: "text",
      text: `特價商品 $ 清單如下：\n\n ${randomProduct.name} 金額＄ ${randomProduct.price}`,
      emojis: [
        {
          index: 5, // 看 $ 這個符號位於文字中的第幾個位子 (index 從 0 開始)
          productId: "5ac21a8c040ab15980c9b43f",
          emojiId: "067",
        },
      ],
    },
    {
      type: "image",
      originalContentUrl: randomProduct.img,
      previewImageUrl: randomProduct.img,
    },
  ]);
};

export const getExpireProductsListBroadcast = async () => {
  const productString = MOCK_SPECIAL_PRODUCTS_DATA.map(
    (product) =>
      `商品編號: ${product.id} , ${product.name} 金額＄ ${product.price}`
  ).join(`\n`);
  return client.broadcast({
    type: "text",
    text: `本月 即將到期商品 $ 清單如下：\n\n${productString} \n\n請操作人員協助後續處理，謝謝！`,
    emojis: [
      {
        index: 10, // index 代表 $ 符號所在的的位置，以上面為例：『本月 即將到期商品 $』 前字號位於第 10 個字元
        productId: "5ac2213e040ab15980c9b447", // Doc: https://developers.line.biz/en/docs/messaging-api/emoji-list/
        emojiId: "005",
      },
    ],
  });
};
