import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import router from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);

const PORT = ENV.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
