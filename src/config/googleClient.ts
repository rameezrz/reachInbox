import { google } from "googleapis";
import { ENV } from "./env";

export const oAuth2Client = new google.auth.OAuth2(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
  ENV.GOOGLE_REDIRECT_URI
);

export const scopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.send",
];
