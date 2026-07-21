import prisma from "../lib/prisma.js";
import { generateProblem } from "./problemService.js"
import { submitSolutionsToAI } from "./submissionService.js";
export async function createChallenge(data, userId) {
    const { groupId, difficulty, category, durationSeconds, language } = data;
    const group = await prisma.grupos.findUnique({
        where: {
            id: Number(groupId)
        }
    })
    if (!group) throw new Error("Group Not Found");
    if (Number(group.ownerId) !== userId) throw new Error("YOU ARE NOT THE OWNER");
    const dataProblem = {
        language: language,
        category: category,
        difficulty: difficulty
    }
    const AIproblem = await generateProblem(dataProblem);
    console.log(AIproblem)

    const challengeGenerated = await prisma.challenge.create({
        data: {
            groupId: Number(groupId),
            language: language.toUpperCase(),
            difficulty: difficulty.toUpperCase(),
            category: category.toUpperCase(),
            durationSeconds: Number(durationSeconds),
            title: AIproblem.title,
            problem: AIproblem.problem,
            referenceSolution: AIproblem.referenceSolution,
            status: "READY"
        }
    })
    if (!challengeGenerated) throw new Error("Error while creating challenge")

    return {
        id: challenge.id,
        groupId: challenge.groupId,
        category: challenge.category,
        language: challenge.language,
        durationSeconds: challenge.durationSeconds,
        title: challenge.title,
        problem: challenge.problem,
        status: challenge.status
    };
}
export async function getChallengeDetails(challengId) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengId
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
    return totalParticipants === totalSubmissions;
}
export async function finishChallenge(userId, challengeId) {
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
    if (challenge.status === "FINISHED") throw new Error("Challenge alredy Finished");
    const isTimeout = hasChallengeEnded(challenge);
    const allsubmitted = await allParticipantsSubmitted(challengeId);
    if (!isTimeout || !allsubmitted) throw new Error("Out of Time or missing participants to submit");
    const startedChalllenge = await prisma.challenge.update({
        where: {
            id: challengeId
        }, data: {
            status: "FINISHED",
            finishedAt: new Date()
        }
    })
    return {
        title: startedChalllenge.title,
        problem: startedChalllenge.problem,
        status: startedChalllenge.status,
        startedAt: startedChalllenge.startedAt,
        finishedAt: startedChalllenge.finishedAt
    }
}
export async function submitAllSolutions(userId, challengeId) {
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
    if (challenge.status !== "FINISHED") throw new Error("challenge completed or not finished");
    const results = await submitSolutionsToAI(challengeId);
    if (!results) throw new Error("Failed to subtmit solutions")
    const completeChallenge = await prisma.challenge.update({
        where: {
            id: challengeId
        }, data: {
            status: "COMPLETED"
        }
    })
    return results;
}
export async function submitSolution(submission, challengeid, userid) {
    const { challengId, userId, type, solution, submitted } = submission;
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
    const alredySubmitted = await prisma.submission.findUnique({
        where: {
            userId_challengeId: {
                userId: userid, challengeId: challengeid
            }
        }
    })
    if (alredySubmitted) throw new Error("Alredy Submitted");
    //if(Number.isNaN(secondsRemainig)){throw new Error("remaining time not provided")}
    if (solution.trim() === "") {
        throw new Error("Provide a valid Solution!");
    }
    const submit = await prisma.submission.create({
        data: {
            challengeId: challengeid,
            userId: userid,
            type: type.toUpperCase(),
            solution: solution,
            submitted: true,
        }
    })
    return submit;
}
export async function joinChallenge(userid, challengeid) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengeid
        }
    })
    if (!challenge) throw new Error("Challenge Not Found");
    if (challenge.status !== "READY") throw new Error("Challenge not redy or finished");
    const joinchallenge = await prisma.challengeParticipants.create({
        data: {
            userId: userid,
            challengeId: challengeid
        }
    })
    return joinchallenge
}