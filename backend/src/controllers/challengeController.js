import { Prisma } from "@prisma/client";
import * as challengeService from "../services/challengeService.js"
import * as resultService from "../services/resultService.js";
export async function createChallenge(req, res) {
    try {
        const data = req.body;
        const userId = Number(req.user.id);
        const challenge = await challengeService.createChallenge(data, userId);
        res.status(201).json({
            message: "Challenge Created!\nInfo:",
            challenge: challenge
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(401).json({
                    message: "Challenge alredy existes"
                })
            } else if (error.code === "P2012") {
                return res.status(400).json({
                    message: "Data Missing"
                })
            }
        } else if (error.message.trim() === "Group Not Found") {
            return res.status(404).json({
                message: error.message
            })
        } else if (error.message.trim() === "YOU ARE NOT THE OWNER") {
            return res.status(403).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message,
            //stack:error.stack
        })
    }
}
export async function getChallengeDetails(req, res) {
    try {
        const challengeId = Number(req.params.challengeId);
        const challenge = await challengeService.getChallengeDetails(challengeId);
        res.status(200).json({
            message: "Challenge Details:", challenge
        })
    } catch (error) {
        if (error.message.trim() === "Challenge Not Found") {
            return res.status(404).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function startChallenge(req, res) {
    try {
        const userId = Number(req.user.id);
        const challengeId = Number(req.params.challengeId);
        const challenge = await challengeService.startChallenge(userId, challengeId);
        res.status(200).json({
            message: "Challenge started:",
            challenge
        })
    } catch (error) {
        if (error.message.trim() === "Challenge Not Found") {
            return res.status(404).json({
                message: error.message
            })
        } else if (error.message.trim() === "YOU ARE NOT THE OWNER") {
            return res.status(403).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function finishChallenge(req, res) {
    try {
        const userId = Number(req.user.id);
        const challengeId = Number(req.params.challengeId);
        const challenge = await challengeService.finishChallenge(userId, challengeId);
        res.status(200).json({
            message: "Challenge finished:",
            challenge
        })
    } catch (error) {
        if (error.message.trim() === "Challenge Not Found") {
            return res.status(404).json({
                message: error.message
            })
        } else if (error.message.trim() === "YOU ARE NOT THE OWNER") {
            return res.status(403).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function submitSolution(req, res) {
    try {
        const challengeId = Number(req.params.challengeId)
        const userId = Number(req.user.id);
        const solution = req.body;
        const submission = await challengeService.submitSolution(solution, challengeId, userId);
        res.status(200).json({
            submission: submission
        })
    } catch (error) {
        if (error.message.trim() === "Challenge Not Found") {
            return res.status(404).json({
                message: error.message
            })
        } else if (error.message.trim() === "Not Participating" ||
            error.message.trim() === "Challenge is not running" ||
            error.message.trim() === "Out of Time!") {
            return res.status(403).json({
                message: error.message
            })
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(409).json({
                    message: "Alredy submitted"
                })
            } else if (error.code === "P2012") {
                return res.status(400).json({
                    message: "Data Missing"
                })
            }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: error.message,
        })
    }
}
export async function submitAllSolutions(req, res) {
    try {
        const userId = Number(req.user.id);
        const challengeId = Number(req.params.challengeId);
        const results = await challengeService.submitAllSolutions(userId, challengeId);
        res.status(200).json({
            message: "Submissios sent",
            results: results
        })
    } catch (error) {
        if (error.message.trim() === "Challenge Not Found") {
            return res.status(404).json({
                message: error.message
            })
        } else if (error.message.trim() === "YOU ARE NOT THE OWNER" ||
            error.message.trim() === "Challenge alredy Finished") {
            return res.status(403).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function joinChallenge(req, res) {
    try {
        const userId = Number(req.user.id);
        const challengeId = Number(req.params.challengeId);
        const joinchallenge = await challengeService.joinChallenge(userId, challengeId);
        res.status(200).json({
            message: "joined",
            joinchallenge
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(409).json({
                    message: "Alredy Participating"
                })
            } else if (error.code === "P2012") {
                return res.status(400).json({
                    message: "Data Missing"
                })
            }
        }
        if (error.message.trim() === "Challenge Not Found") {
            return res.status(404).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function getChallengeResults(req, res) {
    try {
        const challengeId = Number(req.params.challengeId);
        const results = await resultService.getChallengeResults(challengeId);
        res.status(200).json({
            results
        })
    } catch (error) {
        if (error.message.trim() === "Challenge Not Found") {
            return res.status(404).json({
                message: error.message
            })
        } else if (error.message.trim() === "Challenge isn't completed") {
            return res.status(403).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function getChallengeParticipants(req, res) {
    try {
        const challengeId = Number(req.params.challengeId);
        const challenge = await challengeService.getChallengeParticipants(challengeId);
        res.status(200).json({
            participants: challenge
        })

    } catch (error) {
        /*if (error.message.trim() === "No participants") {
            return res.status(409).json({
                message: error.message,
                participants:
            })
        }*/
        res.status(500).json({
            message: error.message
        })
    }
}
