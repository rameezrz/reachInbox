import { google } from "googleapis";
import { oAuth2Client } from "../config/googleClient";
import { findUser, getTokens } from "../db";
import {
  generateResponseMessage,
  processAllEmails,
} from "../utils/gmailHelper";
import {
  createLabel,
  fetchExistingLabels,
  getLabelIds,
} from "../utils/labelsHelper";
import { Label, mailDetails } from "../Types/gmail";

export const fetchEmails = async (userId: number) => {
  try {
    const user = await findUser(undefined, userId);
    const access_token = user?.access_token;
    const refresh_token = user?.refresh_token;

    oAuth2Client.setCredentials({ access_token, refresh_token });
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const res = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
    });
    const messages = res.data.messages || [];

    const emails = await processAllEmails(gmail, messages);
    return emails;
  } catch (error) {
    console.log(error);
  }
};

export const createLabelsIfNotExist = async (
  gmail: any,
  userId: string,
  labels: Label[]
): Promise<string[]> => {
  try {
    const existingLabelMap = await fetchExistingLabels(gmail);
    const createdLabelIds: string[] = [];

    for (const label of labels) {
      if (!existingLabelMap[label.name]) {
        const createdLabelId = await createLabel(gmail, userId, label);
        if (createdLabelId) {
          existingLabelMap[label.name] = createdLabelId;
        }
      }
      if (existingLabelMap[label.name]) {
        createdLabelIds.push(existingLabelMap[label.name]);
      }
    }

    return createdLabelIds;
  } catch (error) {
    console.error(`Error creating labels:`, error);
    return [];
  }
};

export const modifyMessageLabels = async (
  gmail: any,
  messageId: string,
  addLabelNames: string[]
): Promise<void> => {
  try {
    // Fetch existing labels to get their IDs
    const labelMap = await fetchExistingLabels(gmail);

    // Get label IDs to add and remove
    const addLabelIds = getLabelIds(addLabelNames, labelMap);

    // Modify message labels
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        addLabelIds,
        removeLabelIds: ["UNREAD"],
      },
    });
  } catch (error) {
    console.error(`Error modifying message labels:`, error);
  }
};

export const sendEmail = async (mail: mailDetails) => {
  const tokens = await getTokens(mail.toEmail, "google");
  oAuth2Client.setCredentials({
    access_token: tokens?.access_token,
    refresh_token: tokens?.refresh_token,
  });

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const responseMessage = generateResponseMessage(mail.category);

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      threadId: mail.threadId,
      raw: Buffer.from(
        `To: ${mail.fromEmail}\r\n` +
          `Subject: Re: ${mail.subject}\r\n` +
          `In-Reply-To: ${mail.id}\r\n` +
          `References: ${mail.id}\r\n` +
          `From: ${mail.fromName} <${mail.fromEmail}>\r\n` +
          `\r\n` +
          `Hello ${mail.fromName},\r\n\r\n${responseMessage}`
      ).toString("base64"),
    },
  });
  console.log(
    `User : [${mail.toEmail}] - Mail : [${mail.id}] Sent to ${
      mail.fromEmail
    } | ${new Date().toLocaleTimeString()}`
  );
};
