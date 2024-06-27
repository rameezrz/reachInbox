import msal from "@azure/msal-node";
import { ENV } from "./env";

export const msalConfig = {
  auth: {
    clientId: ENV.MS_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/common`,
    clientSecret: ENV.MS_CLIENT_SECRET_VALUE || "",
  },
};

export const REDIRECT_URI = "http://localhost:3001/api/ms-callback";

export const cca = new msal.ConfidentialClientApplication(msalConfig);
