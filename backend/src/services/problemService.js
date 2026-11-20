import prisma from "../lib/prisma.js"
import { callAI } from "./AIService.js"

const LANGUAGE_NAMES = {
    JAVA: "Java",
    JAVASCRIPT: "JavaScript",
    C: "C",
    CPP: "C++",
    C_CHARP: "C#",
    PHYTON: "Python"
};

function cleanText(text) {
    return text
        .replace(/\\n/g, "\n")
        .replace(/&le;/g, "≤")
        .replace(/&ge;/g, "≥")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&ne;/g, "≠")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
}
export async function generateProblem(data) {
    const {
        language,
        category,
        difficulty
    } = data;
    const languageName = LANGUAGE_NAMES[language] || language;
    if (!language || !category || !difficulty) {
        throw new Error(
            "language, category e difficulty são obrigatórios"
        );
    }

const prompt = `
                Você é um criador profissional de desafios de programação para competições de alto nível, no estilo LeetCode, Codeforces e plataformas profissionais de programação competitiva.

                Crie UM desafio de programação.

                Linguagem: ${languageName}
                Categoria: ${category}
                Dificuldade: ${difficulty}

                O desafio deve ser adequado à dificuldade "${difficulty}" e deve exigir raciocínio algorítmico e implementação.

                IMPORTANTE:
                A dificuldade do problema NÃO deve vir de um enunciado confuso ou ambíguo.
                O problema deve ser difícil porque exige uma boa estratégia, análise de complexidade, estruturas de dados, algoritmos ou raciocínio lógico apropriado à dificuldade escolhida.
                Para difuculdades faces crie mesmo exercicioas nao muto difices faces que siravam cmo aqueciemto ou para deixar o participante acostumado . um facil  que seja fazivel mesmo que seja a primeira vez num desafio.
                Para dificuldades mais altas, crie problemas que exijam uma solução algorítmica significativa e que possam diferenciar participantes com diferentes níveis de conhecimento.

                IDIOMA E TEXTO
                O "title" e o "problem" devem estar escritos SEMPRE em português, do início ao fim, incluindo os nomes das secções e as explicações dos exemplos.
                Use apenas texto simples. Escreva os símbolos directamente (≤, ≥, <, >, ≠) e NUNCA entidades HTML como &le; &ge; &lt; &gt;.

                REGRAS DO PROBLEMA
                O participante deve conseguir compreender exatamente o que precisa implementar apenas lendo o campo "problem".

                O problema deve possuir uma única interpretação possível.

                O enunciado deve deixar claramente definido:

                1. O contexto do problema, quando aplicável.
                2. O objetivo exato.
                3. Os dados fornecidos.
                4. Como esses dados devem ser interpretados.
                5. As operações ou condições que devem ser consideradas.
                6. O resultado que deve ser produzido.
                7. Casos especiais relevantes.
                8. Restrições dos dados.
                9. Formato da entrada.
                10. Formato da saída.
                11. Pelo menos um exemplo completo de entrada e saída.
                nao cira problemas repetidos devem ser diversificados
                NÃO forneça dicas de implementação.

                NÃO forneça o algoritmo.

                NÃO forneça pseudocódigo.

                NÃO explique como resolver.

                NÃO revele a ideia principal da solução.

                O participante deve descobrir a estratégia sozinho.

                Porém, todas as regras necessárias para compreender o problema devem estar explicitamente descritas.

                ESTRUTURA DO CAMPO "problem"
            

                TODAS as informações relacionadas ao problema devem estar dentro da string "problem".

                NÃO crie propriedades JSON adicionais como:
                "input",
                "output",
                "constraints",
                "example",
                "rules",
                "solutionExplanation"
                ou qualquer outra propriedade.

                O JSON final DEVE possuir EXATAMENTE estas quatro propriedades:

                {
                "title": "...",
                "problem": "...",
                "referenceSolution": "...",
                "language": "${languageName}"
                }

                Dentro do texto de "problem", organize o enunciado de forma clara utilizando, quando aplicável:

                Descrição:
                [descrição do problema]

                Objectivo:
                [objetivo]

                Entrada:
                [formato e significado da entrada]

                Saída:
                [formato e significado da saída]

                Restrições:
                [restrições]

                Exemplos:
                [exemplos completos]

                É permitido adicionar outras seções dentro da string "problem" quando forem necessárias para explicar corretamente o desafio, como "Regras", "Notas" ou "Casos especiais".

                EXEMPLOS

                Os exemplos devem mostrar claramente:

                Entrada:
                [dados reais]

                Saída:
                [resultado real]

                Explicação:
                [uma explicação curta de por que aquela saída é produzida]

                A explicação do exemplo NÃO deve revelar o algoritmo geral da solução.

                O exemplo deve ser matematicamente e logicamente consistente com todas as regras do problema.

                Sempre que possível, inclua pelo menos dois exemplos, especialmente quando existirem casos diferentes ou casos especiais importantes.
        
                COMPLEXIDADE E QUALIDADE

                O problema deve ser digno de uma competição.

                A dificuldade "${difficulty}" deve influenciar:

                - tamanho das entradas;
                - quantidade de casos possíveis;
                - necessidade de eficiência;
                - complexidade algorítmica;
                - necessidade de estruturas de dados ou técnicas apropriadas;
                - quantidade de condições que precisam ser consideradas.

                Não transforme um problema trivial em um problema "difícil" apenas adicionando uma história ou aumentando o tamanho da entrada.

                O problema deve apresentar um desafio algorítmico real.
                REFERENCE SOLUTION
            
                "referenceSolution" deve conter uma implementação completa e correta do problema na linguagem:

                ${languageName}

                A solução deve:

                - respeitar todas as regras do enunciado;
                - funcionar para todos os casos válidos;
                - respeitar as constraints;
                - produzir exatamente a saída especificada;
                - ser compatível com a linguagem escolhida.

                A solução de referência NÃO deve ser colocada dentro do campo "problem".

                Antes de responder, verifique internamente:

                1. O problema corresponde à categoria "${category}"?
                2. O problema realmente possui dificuldade "${difficulty}"?
                3. O problema é suficientemente desafiador?
                4. Existe apenas uma interpretação possível?
                5. Todas as informações necessárias estão no enunciado?
                6. Input está claramente definido?
                7. Output está claramente definido?
                8. Constraints estão claramente definidas?
                9. Os exemplos são válidos?
                10. A referenceSolution resolve exatamente o problema descrito?
                11. A solução respeita as constraints?
                12. Não existe nenhuma informação necessária escondida na solução?
                13. O problema pode ser compreendido sem receber dicas adicionais?

                Se qualquer resposta for "não", corrija o problema antes de responder.

                FORMATO DA RESPOSTA
             
                RETORNE APENAS JSON VÁLIDO.

                NÃO escreva absolutamente nada antes ou depois do JSON.

                O JSON deve possuir EXATAMENTE estas propriedades:

                {
                "title": "...",
                "problem": "...",
                "referenceSolution": "...",
                "language": "${languageName}"
                }

                NÃO adicione nenhuma propriedade adicional.

                NÃO utilize markdown.

                NÃO utilize blocos de código.

                NÃO escreva comentários.

                NÃO escreva explicações fora do JSON.

                O resultado deve poder ser processado diretamente por:

                JSON.parse()

                Todas as aspas internas das strings devem ser escapadas corretamente.

                Todas as quebras de linha dentro das strings devem ser representadas corretamente.

                RESPOSTA FINAL: APENAS O JSON.
                Lembra de nao retornar uma resposta com markdown, nao queor nada markdown
`;


    const aiResponse = await callAI(prompt);
    if (!aiResponse.title || !aiResponse.problem || !aiResponse.referenceSolution) {
        throw new Error(
            "AI misssing data"
        );
    }
    return {
        title: cleanText(aiResponse.title),
        problem: cleanText(aiResponse.problem),
        referenceSolution: aiResponse.referenceSolution,
        language: aiResponse.language
    };
}