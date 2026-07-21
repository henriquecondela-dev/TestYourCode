import express from "express";
import {getUsers, me,deleteUser} from "../controllers/userController.js";

const router= express.Router();
router.get("/", getUsers);
router.delete("/:id", deleteUser);
router.get("/me", me);

export default router;