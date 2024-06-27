import { register, updateTokens } from "../db";
import {
  fetchEmails,
  modifyMessageLabels,
  sendEmail,
} from "../services/gmailService";
import { analyzeEmailContent } from "../services/openAIService";

export const registerUser = async (email: string, tokens: any) => {
  const newUser = await register(
    email,
    "google",
    tokens.access_token || "",
    tokens.refresh_token || ""
  );
  return newUser;
};

export const updateTokensForUser = async (email: string, tokens: any) => {
  const updatedUser = await updateTokens(
    email,
    tokens.access_token || "",
    tokens.refresh_token || ""
  );
  return updatedUser;
};

const analyzeAndModifyEmail = async (gmail: any, message: any) => {
  const response = await analyzeEmailContent(
    message.subject,
    message.snippet,
    message.msgBody
  );

  switch (response?.split(" ")[0].toLowerCase()) {
    case "a.":
      await modifyMessageLabels(gmail, message.id, ["Interested"]);
      break;
    case "b.":
      await modifyMessageLabels(gmail, message.id, ["Not Interested"]);
      break;
    case "c.":
      await modifyMessageLabels(gmail, message.id, ["More Information"]);
      break;
    default:
      console.log("Default category");
  }

  console.log(
    `User : [${message.toEmail}] - Mail : [${
      message.id
    }] analyzed with category: ${response} | ${new Date().toLocaleTimeString()}`
  );
  return response;
};

export const fetchAndProcessEmails = async (gmail: any, user: any) => {
  const messages = await fetchEmails(user?.id);

  for (const message of messages || []) {
    if (message) {
      const response = await analyzeAndModifyEmail(gmail, message);
      message.category = response || "";
      await sendEmail(message);
    }
  }

  return messages;
};
