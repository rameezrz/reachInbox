import { Request, Response } from "express";
import {
  getMSAccessToken,
  getMSAuthURL,
  getMSUserEmail,
} from "../services/microsoftService";
import { errorHandler } from "../utils/errorHandler";
import { findUser, register, updateTokens } from "../db";
import { registerUser, updateTokensForUser } from "../utils/googleAuthHelper";

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
    const accessToken = await getMSAccessToken(code);
    const email = await getMSUserEmail(accessToken || "");

    let user = await findUser(email || "");
    if (!user) {
      user = await register(email || "", "microsoft", accessToken || "");
    } else {
      user = await updateTokens(email || "", accessToken || "");
    }

    res.status(200).json({ message: "MS OAuth Successfull" });
  } catch (error) {
    errorHandler(res, error as Error);
  }
};
