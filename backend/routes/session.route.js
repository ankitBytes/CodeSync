import express from "express";
import { createSession, joinSession, VerifySession } from "../controller/session.controller.js";
import { VerifyUser } from "../controller/auth.controller.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-session", AuthMiddleware, createSession);
router.get("/verify-session/:sessionId", VerifyUser, VerifySession);
router.post("/join-session", joinSession);

export default router;