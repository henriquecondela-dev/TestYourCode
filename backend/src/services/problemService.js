import prisma from "../lib/prisma.js"
import {callAI} from "./AIService.js"
export async function generateProblem(data) {
    const {
        language,
        category,
        difficulty
    } = data;
    if (!language || !category || !difficulty) {
        throw new Error(
            "language, category e difficulty são obrigatórios"
        );
    }
    const prompt = `
        Crie um desafio de programação.
        Linguagem: ${language}
        Categoria: ${category}
        Dificuldade: ${difficulty}
        Retorne obrigatoriamente:
        {
            "title": "...",
            "problem": "...",
            "referenceSolution": "...",
            "language": "${language}"
        }
        Não adicione nenhum texto fora do JSON, nao esqueca.
    `;
    const aiResponse = await callAI(prompt);
    if (!aiResponse.title || !aiResponse.problem || !aiResponse.referenceSolution) {
        throw new Error(
            "AI misssing data"
        );
    }
    return {
        title: aiResponse.title,
        problem: aiResponse.problem,
        referenceSolution: aiResponse.referenceSolution,
        language: aiResponse.language
    };
}