import OpenAI from "openai";
import { ENV } from "../config/env";

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export const analyzeEmailContent = async (
  subject: string,
  snippet: string,
  msgBody: string
) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Categorize the following email: Subject : ${subject}, Snippet: ${snippet}, Body: ${msgBody} to these categories a. Interested b. Not Interested c. More information`,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 60,
  });

  return response.choices[0].message.content;
};
