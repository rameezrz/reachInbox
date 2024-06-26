import express from "express";
import { googleAuth } from "../controllers/googleAuthController";

const router = express.Router();

router.get("/google-auth", googleAuth);

export default router;
