import { google } from "googleapis";
import { UserInfo } from "../Types/googleAuth";
import { oAuth2Client, scopes } from "../config/googleClient";

export const getGmailAuthUrl = () => {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
};

export const getGmailAccessToken = async (code: string) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return tokens;
  } catch (error) {
    console.log(error);
  }
};

export const getUserEmail = async (
  access_token: string,
  refresh_token: string
): Promise<string | null> => {
  try {
    oAuth2Client.setCredentials({ access_token, refresh_token });
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const response = await gmail.users.getProfile({
      userId: "me",
    });
    return response?.data?.emailAddress || "";
  } catch (error) {
    console.error("Error fetching user email:", error);
    return null;
  }
};
