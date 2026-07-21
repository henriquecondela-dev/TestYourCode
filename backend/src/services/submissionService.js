import prisma from "../lib/prisma.js";
import { callAI } from "./AIService.js";
import submitScript from "./scriptsToAI.js";
export async function submitSolutionsToAI(challengeId) {
    const id = Number(challengeId);
    const challenge = await prisma.challenge.findUnique({
        where: {
            id
        }
    });
    if (!challenge) {
        throw new Error("Challenge Not Found");
    }
    const solutions = await prisma.submission.findMany({
        where: {
            challengeId: id
        }
    });
    if (solutions.length === 0) {
        throw new Error(
            "No Solutions Provided"
        );
    }
    const dataToAI = {
        problem: challenge.problem,
        referenceSolution: challenge.referenceSolution,
        language:challenge.language,
        submissions: solutions.map(solution => ({
            submissionId: solution.id,
            solution: solution.solution
        }))
    };
    const prompt=submitScript(dataToAI);
    const results =  await callAI(prompt);
    if (!results) throw new Error("Results Not Provide by AI");
    console.log(results);
    console.log(typeof results)
    for (const element of results) {
        await prisma.result.create({
            data: {
                challengeId:Number(challengeId),
                submissionId: element.submissionId,
                score: element.score,
                rank: element.rank,
                feedback: element.feedback,
                approved: element.approved
            }
        });
    }
    return results;
}