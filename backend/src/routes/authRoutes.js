import express from "express";
import {login, signup} from "../controllers/authController.js";
import validateUser from "../middlewares/validateUser.js";
const router = express.Router();

router.post("/login", login);
router.post("/signup",validateUser,signup);

export default router;