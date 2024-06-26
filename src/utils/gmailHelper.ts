export const getHeaderValue = (headers: any[], name: string): string => {
  const header = headers.find((header) => header.name === name);
  return header ? header.value : "Not Found";
};

export const extractEmailAndName = (fromValue: string) => {
  const fromMatch = fromValue?.match(/^(.*?)\s*<(.+?)>$/);
  const fromName = fromMatch ? fromMatch[1].trim() : "Not Found";
  const fromEmail = fromMatch ? fromMatch[2] : "Not Found";
  return { fromName, fromEmail };
};

export const decodeBase64 = (base64Data: string): string => {
  const buffer = Buffer.from(base64Data, "base64");
  return buffer.toString("utf8");
};

export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const fetchAndProcessEmail = async (gmail: any, msg: any) => {
  try {
    const response = await gmail.users.messages.get({
      userId: "me",
      id: msg.id || "",
    });
    const message = response.data;
    const headers = message?.payload?.headers || [];
    const subject = getHeaderValue(headers, "Subject");
    const fromValue = getHeaderValue(headers, "From");
    const toEmail = getHeaderValue(headers, "Delivered-To");
    const { fromName, fromEmail } = extractEmailAndName(fromValue);
    const msgBody = decodeBase64(message?.payload?.parts?.[1].body?.data || "");
    const plainTextMsgBody = stripHtmlTags(msgBody);

    console.log(`mail [${message.id}] fetched`);

    return {
      id: message.id || "",
      threadId: message.threadId || "",
      fromEmail: fromEmail || "",
      fromName: fromName || "",
      toEmail: toEmail || "",
      subject: subject || "",
      snippet: message.snippet || "",
      msgBody: plainTextMsgBody || "",
      category: "",
    };
  } catch (error) {
    console.error(`Error fetching message with ID ${msg.id}:`, error);
    return null;
  }
};

export const processAllEmails = async (gmail: any, messages: any[]) => {
  return await Promise.all(
    (messages || []).map((msg) => fetchAndProcessEmail(gmail, msg))
  );
};

export const generateResponseMessage = (category: string) => {
  switch (category.toLowerCase()) {
    case "a.":
      return "Thank you for your interest! Would you like to schedule a demo call?";
    case "b.":
      return "Thank you for your response. If you have any questions, feel free to reach out.";
    case "c.":
      return "Could you please provide more details about your inquiry?";
    default:
      return "Thank you for your email. We will get back to you shortly.";
  }
};
