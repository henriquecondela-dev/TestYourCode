import express from "express";
import {getUsers, me, saveAvatar, changePassword, deleteAccount} from "../controllers/userController.js";

const router= express.Router();
router.get("/", getUsers);
router.get("/me", me);
router.put("/me/avatar", saveAvatar);
router.put("/me/password", changePassword);
router.delete("/me", deleteAccount);

export default router;