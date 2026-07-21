import express from "express";
import {createChallenge,finishChallenge,getChallengeDetails,startChallenge,submitSolution, joinChallenge, submitAllSolutions, getChallengeResults} from "../controllers/challengeController.js"

const router =express.Router();

router.post("/", createChallenge);
router.get("/:challengeId",getChallengeDetails);
router.post("/:challengeId/start",startChallenge);
router.patch("/:challengeId/finish",finishChallenge);
router.post("/:challengeId/submissions", submitSolution);
router.post("/:challengeId/join", joinChallenge);
router.get("/:challengeId/result",getChallengeResults);
router.post("/:challengeId/submissions/all", submitAllSolutions);
router.get("/:challengeId/submissions/me",(req,res)=>{res.status(404).send("ENDPOINT IN DEVELOPMEMT")})

export default router;