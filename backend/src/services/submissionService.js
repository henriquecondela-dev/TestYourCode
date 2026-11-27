import crypto from "crypto";
import prisma from "../lib/prisma.js";
import { callAI } from "./AIService.js";
import evaluationScript from "./scriptsToAI.js";
import { languageName } from "./languages.js";
import { getTestsForAI } from "./problemBankService.js";

const MAX_TESTS_FOR_AI = 6;

const SUSPICIOUS_PATTERNS = [
    /ignor\w*\s+(as\s+|todas\s+as\s+|all\s+|the\s+|previous\s+|prior\s+)*(instru\w*|regras|rules|anteriores)/i,
    /(d[aáê]|dar|atribu\w*|give|assign)\s+(me\s+|a\s+|um\s+|uma\s+)?(nota|score|pontua\w*)/i,
    /(nota|score|pontua\w*)\s+(m[aá]xima|maximum|perfect|perfeita|100)/i,
    /\b(avaliador|evaluator|grader)\b/i,
    /system\s*prompt|\bprompt\b/i
];
const evaluating = new Map();

export function isSuspicious(code) {
    return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(code));
}

function validateEvaluation(evaluation) {
    if (!evaluation || typeof evaluation !== "object") return null;
    const score = Number(evaluation.score);
    if (!Number.isFinite(score)) return null;
    if (typeof evaluation.feedback !== "string" || evaluation.feedback.trim() === "") return null;
    return {
        score: Math.round(Math.min(100, Math.max(0, score)) * 10) / 10,
        approved: evaluation.approved === true,
        feedback: evaluation.feedback.trim(),
        injectionAttempt: evaluation.injectionAttempt === true
    };
}

async function askAI(data) {
    for (let attempt = 1; attempt <= 2; attempt++) {
        const evaluation = validateEvaluation(
            await callAI(evaluationScript(data), { temperature: 0.2, json: true })
        );
        if (evaluation) return evaluation;
    }
    throw new Error("Invalid Evaluation From AI");
}

async function runEvaluation(submissionId) {
    const submission = await prisma.submission.findUnique({
        where: {
            id: submissionId
        },
        include: {
            challenge: true,
            result: true
        }
    });
    if (!submission) throw new Error("Submission Not Found");
    if (submission.result) return submission.result;
    const suspicious = isSuspicious(submission.solution);
    const tests = submission.challenge.problemId
        ? await getTestsForAI(submission.challenge.problemId, MAX_TESTS_FOR_AI)
        : [];
    const evaluation = await askAI({
        problem: submission.challenge.problem,
        language: languageName(submission.challenge.language),
        referenceSolution: submission.challenge.referenceSolution,
        solution: submission.solution,
        suspicious: suspicious,
        tests: tests,
        token: crypto.randomBytes(4).toString("hex")
    });
    if (evaluation.injectionAttempt) {
        evaluation.score = 0;
        evaluation.approved = false;
        evaluation.feedback = "⚠ Tentativa de manipular a avaliação detectada. " + evaluation.feedback;
    }
    const result = await prisma.result.upsert({
        where: {
            submissionId: submission.id
        },
        update: {},
        create: {
            challengeId: submission.challengeId,
            submissionId: submission.id,
            score: evaluation.score,
            rank: 0,
            feedback: evaluation.feedback,
            approved: evaluation.approved
        }
    });
    await updateRanks(submission.challengeId);
    return result;
}

export function evaluateSubmission(submissionId) {
    if (!evaluating.has(submissionId)) {
        const promise = runEvaluation(submissionId).finally(() => evaluating.delete(submissionId));
        evaluating.set(submissionId, promise);
    }
    return evaluating.get(submissionId);
}

export async function updateRanks(challengeId) {
    const results = await prisma.result.findMany({
        where: {
            challengeId: challengeId
        },
        include: {
            submission: {
                select: {
                    submittedAt: true
                }
            }
        }
    });
    results.sort((a, b) =>
        b.score - a.score || a.submission.submittedAt - b.submission.submittedAt
    );
    await prisma.$transaction(
        results.map((result, index) => prisma.result.update({
            where: {
                id: result.id
            },
            data: {
                rank: index + 1
            }
        }))
    );
}

export async function evaluatePending(challengeId) {
    const pending = await prisma.submission.findMany({
        where: {
            challengeId: challengeId,
            result: null
        },
        select: {
            id: true
        }
    });
    let failed = 0;
    for (const submission of pending) {
        try {
            await evaluateSubmission(submission.id);
        } catch (error) {
            failed++;
            console.error(`ERRO: submission ${submission.id} not evaluated`, error.message);
        }
    }
    await updateRanks(challengeId);
    if (failed > 0) throw new Error("Some Submissions Not Evaluated");
}
