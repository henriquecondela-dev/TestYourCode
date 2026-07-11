import express from "express";
import {getUsers, getUserProfile, createUser,deleteUser} from "../controllers/userController.js";

const router= express.Router();
router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUserProfile);

export default router;