import "dotenv/config"
import callGemini from "./ai/gemini.js";
import callGroq from "./ai/groq.js";

export async function callAI(prompt) {
    switch (process.env.AI_PROVIDER) {
        case "groq":
            return callGroq(prompt);
        case "gemini":
            return callGemini(prompt) ;
    }
}