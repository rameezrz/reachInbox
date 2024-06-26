import { Request, Response } from "express";
import {
  getGmailAccessToken,
  getGmailAuthUrl,
  getUserEmail,
} from "../services/googleService";
import { errorHandler } from "../utils/errorHandler";
import { findUser, register, updateTokens } from "../db";

export const googleAuth = (req: Request, res: Response) => {
  try {
    const authUrl = getGmailAuthUrl();
    res.json(authUrl);
  } catch (error) {
    errorHandler(res, error as Error);
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const tokens = await getGmailAccessToken(code);

    const email = await getUserEmail(
      tokens?.access_token || "",
      tokens?.refresh_token || ""
    );
    let user = await findUser(email || "");

    if (!user) {
      const newUser = await register(
        email || "",
        "google",
        tokens?.access_token || "",
        tokens?.refresh_token || ""
      );
      user = newUser;
    } else {
      const updatedUser = await updateTokens(
        email || "",
        tokens?.access_token || "",
        tokens?.refresh_token || ""
      );
      user = updatedUser;
    }

    res.status(200).send("Google OAuth successful");
  } catch (error) {
    errorHandler(res, error as Error);
  }
};
