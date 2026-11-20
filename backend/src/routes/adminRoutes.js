import express from "express";
import { broadcast, sendToUser } from "../controllers/adminController.js";

const router = express.Router();
router.post("/broadcast", broadcast);
router.post("/email", sendToUser);

export default router;
