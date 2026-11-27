import "dotenv/config"
import callGemini from "./ai/gemini.js";
import callGroq from "./ai/groq.js";

export async function callAI(input, options = {}) {
    switch (process.env.AI_PROVIDER) {
        case "groq":
            return callGroq(input, options);
        case "gemini":
            return callGemini(input, options);
        default:
            throw new Error("AI_PROVIDER not configured");
    }
}
