import { Request, Response } from "express";
import {
  getGmailAccessToken,
  getGmailAuthUrl,
  getUserEmail,
} from "../services/googleService";
import { errorHandler } from "../utils/errorHandler";
import { findUser } from "../db";
import {
  fetchAndProcessEmails,
  registerUser,
  updateTokensForUser,
} from "../utils/googleAuthHelper";
import { oAuth2Client } from "../config/googleClient";
import { google } from "googleapis";
import { createLabelsIfNotExist } from "../services/gmailService";
import { LABELS } from "../constants";

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
      user = await registerUser(email || "", tokens);
    } else {
      user = await updateTokensForUser(email || "", tokens);
    }

    oAuth2Client.setCredentials({
      access_token: tokens?.access_token || "",
      refresh_token: tokens?.refresh_token || "",
    });
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const labelIds = await createLabelsIfNotExist(gmail, "me", LABELS);
    const messages = await fetchAndProcessEmails(gmail, user);

    res.status(200).send("Google OAuth successful");
  } catch (error) {
    errorHandler(res, error as Error);
  }
};
