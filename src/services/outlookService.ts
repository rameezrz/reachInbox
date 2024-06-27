import axios from "axios";
import { generateResponseMessage, stripHtmlTags } from "../utils/gmailHelper";
import { mailDetails } from "../Types/gmail";

const GRAPH_API_ENDPOINT =
  "https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages";

export const fetchOutlookEmails = async (accessToken: string) => {
  try {
    const response = await axios.get(GRAPH_API_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        $filter: "isRead eq false", // Filter for unread emails
      },
    });

    const emails = response.data.value.map((message: any) => {
      const fromEmail = message.from?.emailAddress?.address || "";
      const fromName = message.from?.emailAddress?.name || "";
      const toEmail = message.toRecipients?.[0]?.emailAddress?.address || "";
      const plainTextMsgBody = stripHtmlTags(message.body?.content || "");
      return {
        id: message.id || "",
        threadId: message.conversationId || "",
        fromEmail: fromEmail,
        fromName: fromName,
        toEmail: toEmail,
        subject: message.subject || "",
        snippet: message.bodyPreview || "",
        msgBody: plainTextMsgBody,
        category: "",
      };
    });

    return emails;
  } catch (error) {
    console.log(error);
  }
};

const GRAPH_API_SENDMAIL_ENDPOINT =
  "https://graph.microsoft.com/v1.0/me/sendMail";

export const sendOutlookEmail = async (
  accessToken: string,
  email: mailDetails
) => {
  try {
    const responseMessage = generateResponseMessage(email.category);
    const payload = {
      message: {
        subject: `Re: ${email.subject}`,
        body: {
          contentType: "Text",
          content: `Hello ${email.fromName}, ${responseMessage}`,
        },
        toRecipients: [
          {
            emailAddress: {
              address: email.fromEmail,
            },
          },
        ],
      },
      saveToSentItems: true,
    };

    // Make the request to send the email
    const response = await axios.post(GRAPH_API_SENDMAIL_ENDPOINT, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.log(error);
    return JSON.stringify(error);
  }
};
