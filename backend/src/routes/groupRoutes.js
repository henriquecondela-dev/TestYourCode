import express from "express";
import {createGroup, deleteGroup, getChallenges, getGroups,getMyGroups, joinInGroup, leaveGroup} from "../controllers/groupController.js";
const router= express.Router();
router.post("/", createGroup);
router.get("/",getGroups);
router.get("/my", getMyGroups);
router.post("/:id/join", joinInGroup);
router.delete("/:id/leave", leaveGroup);
router.delete("/:id", deleteGroup);
router.get("/:groupId/challenges",getChallenges)

export default router;
