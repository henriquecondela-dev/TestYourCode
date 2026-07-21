import prisma from "../lib/prisma.js";


export async function getChallengeResults(challengeId) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            id: challengeId
        }
    });
    if (!challenge) {
        throw new Error("Challenge Not Found");
    }
    if (challenge.status !== "COMPLETED") throw new Error("Challenge isn't completed");
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
                            username: true
                        }
                    }
                }
            }
        },
        orderBy: {
            score: "desc"
        }
    });
    const ranking = results.map(result => ({
        userId: result.submission.user.id,
        username: result.submission.user.username,
        rank: result.rank,
        score: result.score,
        feedback: result.feedback,
        approved: result.approved,
    }));
    return ranking;
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