import { readFile } from "fs/promises";
import prisma from "../src/lib/prisma.js";

const file = new URL("./problems.json", import.meta.url);
const problems = JSON.parse(await readFile(file, "utf-8"));
const MAX_ATTEMPTS = 3;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveProblem(problem) {
    const data = {
        title: problem.title,
        statement: problem.statement,
        difficulty: problem.difficulty,
        category: problem.category,
        inspiredBy: problem.inspiredBy,
        sourceUrl: problem.sourceUrl,
        referenceSolution: problem.referenceSolution,
        status: "APPROVED"
    };
    await prisma.$transaction(async (tx) => {
        const saved = await tx.problem.upsert({
            where: {
                slug: problem.slug
            },
            update: data,
            create: { slug: problem.slug, ...data }
        });
        await tx.testCase.deleteMany({
            where: {
                problemId: saved.id
            }
        });
        await tx.testCase.createMany({
            data: problem.testCases.map(test => ({
                problemId: saved.id,
                input: test.input,
                expectedOutput: test.expectedOutput,
                isSample: test.isSample
            }))
        });
    }, {
        maxWait: 20000,
        timeout: 60000
    });
}

for (const problem of problems) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            await saveProblem(problem);
            break;
        } catch (error) {
            if (attempt === MAX_ATTEMPTS) throw error;
            console.log(`  ${problem.slug} failed (${error.code || error.message}), trying again...`);
            await wait(3000);
        }
    }
    console.log(`${problem.difficulty.padEnd(6)} ${problem.slug}`);
}
console.log(`\n${problems.length} problems in the bank.`);
await prisma.$disconnect();