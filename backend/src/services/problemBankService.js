import prisma from "../lib/prisma.js";

const SOURCES = {
    "hackerrank.com": "HackerRank",
    "leetcode.com": "LeetCode",
    "beecrowd.com.br": "Beecrowd"
};

export async function pickClassic(groupId, difficulty, category) {
    const where = {
        status: "APPROVED",
        difficulty: difficulty
    };
    if (category !== "RANDOM") {
        where.category = category;
    }
    const candidates = await prisma.problem.findMany({
        where: where,
        select: {
            id: true
        }
    });
    if (candidates.length === 0) return null;
    const played = await prisma.challenge.findMany({
        where: {
            groupId: groupId,
            problemId: {
                not: null
            }
        },
        select: {
            problemId: true
        }
    });
    const playedIds = new Set(played.map(challenge => challenge.problemId));
    const notPlayed = candidates.filter(problem => !playedIds.has(problem.id));
    const pool = notPlayed.length > 0 ? notPlayed : candidates;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    return await prisma.problem.findUnique({
        where: {
            id: chosen.id
        }
    });
}

export function classicStatement(problem) {
    if (!problem.inspiredBy) return problem.statement;
    if (!problem.sourceUrl) {
        return problem.statement + `\n\nInspirado em: ${problem.inspiredBy} (problema clássico)`;
    }
    const host = new URL(problem.sourceUrl).hostname.replace("www.", "");
    const source = SOURCES[host] || host;
    return problem.statement + `\n\nInspirado em: ${problem.inspiredBy} (${source})\n${problem.sourceUrl}`;
}

export async function getTestsForAI(problemId, limit) {
    return await prisma.testCase.findMany({
        where: {
            problemId: problemId
        },
        orderBy: [
            { isSample: "desc" },
            { id: "asc" }
        ],
        take: limit
    });
}
