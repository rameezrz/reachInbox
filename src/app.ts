import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import router from "./routes";
import { scheduleEmailFetching } from "./services/taskService";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);

const PORT = ENV.PORT || 3001;
const startServer = async () => {
  await scheduleEmailFetching();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Error starting the server: ", err);
});
