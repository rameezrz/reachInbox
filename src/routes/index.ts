import express from "express";
import {
  googleAuth,
  googleAuthCallback,
} from "../controllers/googleAuthController";
import { microsoftAuth, msAuthCallback } from "../controllers/msAuthController";

const router = express.Router();

router.get("/google-auth", googleAuth);
router.get("/google-callback", googleAuthCallback);

router.get("/ms-auth", microsoftAuth);
router.get("/ms-callback", msAuthCallback);

export default router;
