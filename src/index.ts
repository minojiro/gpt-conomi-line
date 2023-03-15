import express from "express";
import type { MessageEvent, EventBase } from "@line/bot-sdk";
import { lineReply } from "./lineClient";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_, res) => {
  res.json({ ok: true });
});

app.post("/webhook", (req, _) => {
  const [event] = req.body.events as (MessageEvent & EventBase)[];
  if (!event || event.type !== "message" || !event.source.userId) {
    return;
  }
  const { text } = event.message as { text: string };
  console.log(event.source.userId, text);
  lineReply(event.replyToken, `お兄ちゃん、${text}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://0.0.0.0:${PORT}`);
});
