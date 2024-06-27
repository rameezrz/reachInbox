import axios from "axios";
import { REDIRECT_URI, cca } from "../config/microsoftClient";
import { ENV } from "../config/env";

const msalConfig = {
  clientId: ENV.MS_CLIENT_ID || "",
  clientSecret: ENV.MS_CLIENT_SECRET_VALUE || "",
  redirectUri: "http://localhost:3001/api/ms-callback",
};

const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

export async function getAccessToken() {
  const tokenRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  const response = await cca.acquireTokenByClientCredential(tokenRequest);
  return response?.accessToken;
}

export const getMSAuthURL = async () => {
  try {
    const authUrl = await cca.getAuthCodeUrl({
      scopes: ["user.read", "mail.read", "mail.send", "offline_access"],
      redirectUri: REDIRECT_URI,
    });
    return authUrl;
  } catch (error) {
    console.log(error);
  }
};

export const getMSAccessToken = async (code: string) => {
  const tokenRequest = {
    client_id: msalConfig.clientId,
    scope: "user.read mail.read mail.send offline_access",
    code,
    redirect_uri: msalConfig.redirectUri,
    grant_type: "authorization_code",
    client_secret: msalConfig.clientSecret,
  };
  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams(tokenRequest).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    return { accessToken: access_token, refreshToken: refresh_token };
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
