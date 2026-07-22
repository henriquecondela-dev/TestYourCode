import prisma from "../lib/prisma.js"
import { callAI } from "./AIService.js"
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
        Retorne obrigatoriamente um resposta no formato json nada mais alem de um jsno nao esqueva em nenhuma circunstacia algum texto fora do json:
        {
            "title": "...",
            "problem": "...",
            "referenceSolution": "...",
            "language": "${language}"
        }
            IMPORTANTE:

            Sua resposta será processada automaticamente usando JSON.parse().

            Portanto:

                - Retorne APENAS JSON.
                - Não utilize markdown.
                -Não escreva comentários.
                - Não escreva explicações.
                - Não escreva texto antes nem depois.
                - Todo o JSON deve ser válido segundo a especificação RFC 8259.
                - Todas as aspas internas das strings devem ser escapadas corretamente.
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