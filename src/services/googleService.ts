import { oAuth2Client, scopes } from "../config/googleClient";

export const getGmailAuthUrl = () => {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
};
