import { Request, Response } from "express";
import {
  getMSAccessToken,
  getMSAuthURL,
  getMSUserEmail,
} from "../services/microsoftService";
import { errorHandler } from "../utils/errorHandler";
import { findUser, register, updateTokens } from "../db";
import {
  fetchOutlookEmails,
  sendOutlookEmail,
} from "../services/outlookService";
import { analyzeEmailContent } from "../services/openAIService";

export const microsoftAuth = async (req: Request, res: Response) => {
  try {
    const authUrl = await getMSAuthURL();
    res.json(authUrl);
  } catch (error) {
    errorHandler(res, error as Error);
  }
};

export const msAuthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const tokens = await getMSAccessToken(code);
    const email = await getMSUserEmail(tokens?.accessToken || "");
    let user = await findUser(email || "");
    if (!user) {
      user = await register(
        email || "",
        "microsoft",
        tokens?.accessToken,
        tokens?.refreshToken
      );
    } else {
      user = await updateTokens(
        email || "",
        tokens?.accessToken,
        tokens?.refreshToken
      );
    }
    const emails = await fetchOutlookEmails(tokens?.accessToken);
    for (const email of emails) {
      const response = await analyzeEmailContent(
        email.subject,
        email.snippet,
        email.msgBody
      );
      email.category = response;
      const sentResponse = await sendOutlookEmail(tokens?.accessToken, email);
      console.log(sentResponse);
      console.log(`Msg sent....`);
    }

    res.status(200).json({ message: "MS OAuth Successfull" });
  } catch (error) {
    errorHandler(res, error as Error);
  }
};
