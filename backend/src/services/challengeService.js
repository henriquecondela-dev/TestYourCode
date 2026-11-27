import prisma from "../lib/prisma.js";
import { generateProblem } from "./problemService.js"
import { pickClassic } from "./problemBankService.js";
import { evaluatePending, evaluateSubmission } from "./submissionService.js";

const MAX_SOLUTION_LENGTH = 20000;
export async function createChallenge(data, userId) {
    const { groupId, difficulty, category, durationSeconds, language } = data;
    const mode = (data.mode || "NORMAL").toUpperCase();
    if (mode !== "NORMAL" && mode !== "CLASSIC") throw new Error("Invalid Mode");
    const group = await prisma.grupos.findUnique({
        where: {
            id: Number(groupId)
        }
    })
    if (!group) throw new Error("Group Not Found");
    if (Number(group.ownerId) !== userId) throw new Error("YOU ARE NOT THE OWNER");
    let problem = null;
    let notice = null;
    if (mode === "CLASSIC") {
        const classic = await pickClassic(Number(groupId), difficulty.toUpperCase(), category.toUpperCase());
        if (classic) {
            problem = {
                problemId: classic.id,
                title: classic.title,
                problem: classic.statement,
                referenceSolution: classic.referenceSolution
            };
        } else {
            notice = "There are no classic challenges for this category and difficulty yet, so the AI created a new one.";
        }
    }
    if (!problem) {
        const AIproblem = await generateProblem({
            language: language,
            category: category,
            difficulty: difficulty
        });
        problem = {
            problemId: null,
            title: AIproblem.title,
            problem: AIproblem.problem,
            referenceSolution: AIproblem.referenceSolution
        };
    }
    const challenge = await prisma.challenge.create({
        data: {
            groupId: Number(groupId),
            language: language.toUpperCase(),
            difficulty: difficulty.toUpperCase(),
            category: category.toUpperCase(),
            durationSeconds: Number(durationSeconds),
            title: problem.title,
            problem: problem.problem,
            referenceSolution: problem.referenceSolution,
            problemId: problem.problemId,
            status: "READY"
        }
    })
    if (!challenge) throw new Error("Error while creating challenge");
    const partipate = await joinChallenge(userId, challenge.id);
    return {
        id: challenge.id,
        groupId: challenge.groupId,
        category: challenge.category,
        language: challenge.language,
        durationSeconds: challenge.durationSeconds,
        title: challenge.title,
        problem: challenge.problem,
        status: challenge.status,
        mode: challenge.problemId ? "CLASSIC" : "NORMAL",
        notice: notice
    };
}
export async function getChallengeDetails(challengId) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengId
        }, select: {
            id: true,
            groupId: true,
            language: true,
            difficulty: true,
            problem: true,
            category: true,
            status: true,
            createdAt: true,
            startedAt: true,
            finishedAt: true,
            durationSeconds: true
        }
    })
    if (!challenge) throw new Error("Challenge Not Found");
    return challenge;
}
export async function startChallenge(userId, challengeId) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengeId
        }
    })
    if (!challenge) throw new Error("Challenge Not Found");
    const groupId = Number(challenge.groupId);
    const group = await prisma.grupos.findFirst({
        where: {
            id: groupId,
            ownerId: userId
        }
    })
    if (!group) throw new Error("YOU ARE NOT THE OWNER");
    if (challenge.status !== "READY") throw new Error("Challenge Finished or running");
    const startedChalllenge = await prisma.challenge.update({
        where: {
            id: challengeId
        }, data: {
            status: "RUNNING",
            startedAt: new Date()
        }
    })
    return {
        title: startedChalllenge.title,
        problem: startedChalllenge.problem,
        status: startedChalllenge.status,
        startedAt: startedChalllenge.startedAt
    }
}

export function hasChallengeEnded(challenge) {
    const now = new Date();
    const endTime = new Date(
        challenge.startedAt.getTime() +
        challenge.durationSeconds * 1000
    );
    return now >= endTime;
}
async function allParticipantsSubmitted(challengeId) {
    const totalParticipants = await prisma.challengeParticipants.count({ where: { challengeId } });
    const totalSubmissions = await prisma.submission.count({ where: { challengeId } });
    //console.log(totalSubmissions, totalParticipants)
    return totalParticipants === totalSubmissions;
}
async function isParticipantOrOwner(userId, challenge) {
    const member = await prisma.challengeParticipants.findUnique({
        where: {
            challengeId_userId: {
                challengeId: challenge.id,
                userId: userId
            }
        }
    })
    if (member) return true;
    const group = await prisma.grupos.findFirst({
        where: {
            id: Number(challenge.groupId),
            ownerId: userId
        }
    })
    return Boolean(group);
}
async function evaluateChallenge(challengeId) {
    try {
        await evaluatePending(challengeId);
        return await prisma.challenge.update({
            where: {
                id: challengeId
            }, data: {
                status: "COMPLETED"
            }
        })
    } catch (error) {
        await prisma.challenge.update({
            where: {
                id: challengeId
            }, data: {
                status: "FINISHED"
            }
        })
        throw error;
    }
}
export async function finishChallenge(userId, challengeId) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengeId
        }
    })
    if (!challenge) throw new Error("Challenge Not Found");
    const canFinish = await isParticipantOrOwner(userId, challenge);
    if (!canFinish) throw new Error("Not Participating");
    if (challenge.status !== "RUNNING") throw new Error("Challenge Already Finished");
    const isTimeout = hasChallengeEnded(challenge);
    const allsubmitted = await allParticipantsSubmitted(challengeId);
    if (!isTimeout && !allsubmitted) throw new Error("Challenge Still Running");
    const claimed = await prisma.challenge.updateMany({
        where: {
            id: challengeId,
            status: "RUNNING"
        }, data: {
            status: "EVALUATING",
            finishedAt: new Date()
        }
    })
    if (claimed.count === 0) throw new Error("Challenge Already Finished");
    const finishedChallenge = await evaluateChallenge(challengeId);
    return {
        title: finishedChallenge.title,
        status: finishedChallenge.status,
        startedAt: finishedChallenge.startedAt,
        finishedAt: finishedChallenge.finishedAt
    }
}
export async function submitAllSolutions(userId, challengeId) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengeId
        }
    })
    if (!challenge) throw new Error("Challenge Not Found");
    const group = await prisma.grupos.findFirst({
        where: {
            id: Number(challenge.groupId),
            ownerId: userId
        }
    })
    if (!group) throw new Error("YOU ARE NOT THE OWNER");
    const stuckEvaluating = challenge.status === "EVALUATING" && Date.now() - new Date(challenge.finishedAt).getTime() > 120000;
    if (challenge.status !== "FINISHED" && !stuckEvaluating) throw new Error("Challenge Already Finished");
    await prisma.challenge.update({
        where: {
            id: challengeId
        }, data: {
            status: "EVALUATING"
        }
    })
    await evaluateChallenge(challengeId);
    return await prisma.result.findMany({ where: { challengeId } });
}
export async function submitSolution(submission, challengeid, userid) {
    const { solution } = submission;
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengeid
        }
    })
    if (!challenge) throw new Error("Challenge Not Found");
    const member = await prisma.challengeParticipants.findUnique({
        where: {
            challengeId_userId: {
                challengeId: Number(challengeid),
                userId: Number(userid)
            }
        }
    })
    if (!member) throw new Error("Not Participating");
    if (challenge.status !== "RUNNING") throw new Error("Challenge is not running");
    const alreadySubmitted = await prisma.submission.findUnique({
        where: {
            userId_challengeId: {
                userId: userid, challengeId: challengeid
            }
        }
    })
    if (alreadySubmitted) throw new Error("Already Submitted");
    //if(Number.isNaN(secondsRemainig)){throw new Error("remaining time not provided")}
    if (typeof solution !== "string" || solution.trim() === "") {
        throw new Error("Provide a valid Solution!");
    }
    if (solution.length > MAX_SOLUTION_LENGTH) {
        throw new Error("Solution Too Long");
    }
    const submit = await prisma.submission.create({
        data: {
            challengeId: challengeid,
            userId: userid,
            type: "TEXT",
            solution: solution,
            submitted: true,
        }
    })
    evaluateSubmission(submit.id).catch(error => {
        console.error(`ERRO: submission ${submit.id} not evaluated`, error.message);
    });
    return submit;
}
export async function joinChallenge(userid, challengeid) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengeid
        }
    })
    if (!challenge) throw new Error("Challenge Not Found");
    const member = await prisma.challengeParticipants.findUnique({
        where: {
            challengeId_userId: {
                challengeId: challengeid,
                userId: userid
            }
        }
    })
    if (member) throw new Error("Already participating");
    if (challenge.status !== "READY") throw new Error("Challenge not ready or finished");

    const joinchallenge = await prisma.challengeParticipants.create({
        data: {
            userId: userid,
            challengeId: challengeid
        }
    })
    return joinchallenge
}
export async function getChallengeParticipants(challengeId) {
    const participants = await prisma.challengeParticipants.findMany({
        where: {
            challengeId: Number(challengeId)
        }, select: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    avatarColor: true,
                    submissions: {
                        where: {
                            challengeId: Number(challengeId)
                        }
                    }
                }
            }
        }
    })
    return participants.map(participant => participant.user);
}