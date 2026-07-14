import express from "express";
import {createGroup, deleteGroup} from "../controllers/groupController.js";
const router= express.Router();
router.post("/", createGroup);
router.delete("/:id", deleteGroup);

export default router;
