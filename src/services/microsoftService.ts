import axios from "axios";
import { REDIRECT_URI, cca } from "../config/microsoftClient";

export const getMSAuthURL = async () => {
  try {
    const authUrl = await cca.getAuthCodeUrl({
      scopes: ["user.read", "mail.read"],
      redirectUri: REDIRECT_URI,
    });
    return authUrl;
  } catch (error) {
    console.log(error);
  }
};

export const getMSAccessToken = async (code: string) => {
  const tokenRequest = {
    code,
    scopes: ["user.read", "mail.read"],
    redirectUri: REDIRECT_URI,
  };
  try {
    const response = await cca.acquireTokenByCode(tokenRequest);
    return response?.accessToken;
  } catch (error) {
    console.log(error);
  }
};

export const getMSUserEmail = async (accessToken: string) => {
  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.mail;
  } catch (error) {
    console.log(error);
  }
};
