import prisma from "../lib/prisma.js";


const LIVE_STATUS = ["RUNNING", "EVALUATING", "FINISHED", "COMPLETED"];

export async function getChallengeResults(challengeId, userId) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengeId
        }
    });
    if (!challenge) {
        throw new Error("Challenge Not Found");
    }
    if (!LIVE_STATUS.includes(challenge.status)) throw new Error("Challenge hasn't started");
    const final = challenge.status === "COMPLETED";
    const results = await prisma.result.findMany({
        where: {
            challengeId: Number(challengeId)
        },
        include: {
            submission: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            avatarColor: true
                        }
                    }
                }
            }
        },
        orderBy: {
            rank: "asc"
        }
    });
    const totalSubmissions = await prisma.submission.count({
        where: {
            challengeId: Number(challengeId)
        }
    });
    const ranking = results.map(result => {
        const isMe = result.submission.user.id === userId;
        return {
            userId: result.submission.user.id,
            username: result.submission.user.username,
            avatar: result.submission.user.avatar,
            avatarColor: result.submission.user.avatarColor,
            rank: result.rank,
            score: result.score,
            feedback: final || isMe ? result.feedback : null,
            approved: final || isMe ? result.approved : null,
            isMe: isMe
        }
    });
    return {
        status: challenge.status,
        final: final,
        pending: totalSubmissions - results.length,
        results: ranking
    };
}
/**const results: ({
 submission: {
 user: {
 id: number;
 username: string;
 };
 } & {
 id: number;
 challengeId: number;
 userId: number;
 type: $Enums.Type;
 solution: string;
 submitted: boolean;
 submittedAt: Date;
 };
} & {
 id: number;
 submissionId: number;
 challengeId: number;
 score: number;
 rank: number;
 feedback: string;
 approved: boolean;
})[] */