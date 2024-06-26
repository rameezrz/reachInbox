import express from "express";
import {
  googleAuth,
  googleAuthCallback,
} from "../controllers/googleAuthController";

const router = express.Router();

router.get("/google-auth", googleAuth);
router.get("/google-callback", googleAuthCallback);

export default router;
