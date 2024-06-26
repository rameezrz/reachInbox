import { Request, Response } from "express";
import { getGmailAuthUrl } from "../services/googleService";

export const googleAuth = (req: Request, res: Response) => {
  const authUrl = getGmailAuthUrl();
  res.json(authUrl);
};
