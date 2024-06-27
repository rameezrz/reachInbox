import { google } from "googleapis";
import emailQueue, { connection } from "../config/emailQueue";
import { oAuth2Client } from "../config/googleClient";
import { getUsers } from "../db";
import { fetchAndProcessEmails } from "../utils/googleAuthHelper";
import { QueueEvents, Worker } from "bullmq";

export const scheduleEmailFetching = async () => {
  emailQueue.add("fetchEmails", {}, { repeat: { pattern: "*/5 * * * *" } });
};

const worker = new Worker(
  "emailQueue",
  async (job) => {
    if (job.name === "fetchEmails") {
      const users = await getUsers();

      for (const user of users) {
        oAuth2Client.setCredentials({
          access_token: user?.access_token || "",
          refresh_token: user?.refresh_token || "",
        });
        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
        const messages = await fetchAndProcessEmails(gmail, user);
      }
    }
  },
  { connection }
);

const queueEvents = new QueueEvents("emailQueue", { connection });

queueEvents.on("completed", ({ jobId }) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`Email Fetching completed at ${timestamp}`);
});

queueEvents.on(
  "failed",
  ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error("error fetching", failedReason);
  }
);
