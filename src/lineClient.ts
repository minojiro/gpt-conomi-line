import https from "https";

const { LINE_CHANNEL_ACCESS_TOKEN } = process.env;

export const lineReply = (replyToken: string, text: string) => {
  if (!text) {
    console.log("message is empty");
    return;
  }
  const body = JSON.stringify({
    replyToken,
    messages: [{ type: "text", text }],
  });
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
  };
  const webhookOptions = {
    hostname: "api.line.me",
    path: "/v2/bot/message/reply",
    method: "POST",
    headers,
    body,
  };

  const request = https.request(webhookOptions, (res) => {
    res.on("data", (d) => process.stdout.write(d));
  });

  request.on("error", (err) => {
    console.error(err);
  });

  request.write(body);
  request.end();
};
