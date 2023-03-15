import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const createCompletion = async (prompt: string) => {
  const { data } = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    n: 1,
    max_tokens: 1024,
  });
  const [choice] = data.choices;
  return (choice?.text || "").replace(/\n/g, "");
};
