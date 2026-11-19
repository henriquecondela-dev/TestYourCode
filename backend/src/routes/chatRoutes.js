import express from "express";
import { sendMessage, syncChat } from "../controllers/chatController.js";

const router = express.Router();
router.post("/messages", sendMessage);
router.get("/sync", syncChat);

export default router;
