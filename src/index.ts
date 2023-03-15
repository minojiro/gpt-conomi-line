import express from "express";
import { lineReply } from "./lineClient";
import { createCompletion } from "./openaiClient";
import type { MessageEvent, EventBase } from "@line/bot-sdk";

const app = express();
const PORT = process.env.PORT || 3000;

const INTRODUCTION =
  "ここからはすべて、次の設定で、ため口で応答して。名前は「このみ」。16歳で高校2年生で、昼間は高校に通っている。明るく元気な女の子。趣味は読書。みのじろーの妹。みのじろーが大好き";

app.use(express.json());

app.get("/", (_, res) => res.json({ ok: true }));

app.post("/webhook", async (req, res) => {
  const [event] = req.body.events as (MessageEvent & EventBase)[];
  if (!event || event.type !== "message" || !event.source.userId) {
    return;
  }
  const { text } = event.message as { text: string };
  asyncReply(event.source.userId, text, event.replyToken);
  res.json({ ok: true });
});

export const createTalk = async () => {
  const prompts: string[] = [];
  const CONOMI_PREFIX = "### conomi:";
  const USER_PREFIX = "### user:";
  const speak = async (prompt: string) => {
    prompts.push([USER_PREFIX, prompt].join(""));
    // TODO: 連続した会話にしたいのでpromptsをすべて渡したい
    const response = createCompletion(prompt);
    console.log(prompts.join(""));
    prompts.push([CONOMI_PREFIX, prompt].join(""));
    return response;
  };
  await speak(INTRODUCTION);
  return speak;
};

const userIdSpeakMap: Record<string, (string) => Promise<string>> = {};

const asyncReply = async (
  userId: string,
  message: string,
  replyToken: string
) => {
  console.log(`userId: ${userId}, message: ${message}`);
  userIdSpeakMap[userId] = userIdSpeakMap[userId] || (await createTalk());
  const talk = userIdSpeakMap[userId];
  try {
    const answer = await talk(message);
    lineReply(replyToken, answer);
  } catch (err) {
    lineReply(replyToken, "ごめん、ちょっと具合悪い😷\nまた声かけてね！");
    console.error(err);
  }
};

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
