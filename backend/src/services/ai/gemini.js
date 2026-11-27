import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function callGemini(input, options = {}) {
    try {
        const config = {};
        let contents = input;
        if (typeof input !== "string") {
            config.systemInstruction = input.system;
            contents = input.user;
        }
        if (options.temperature !== undefined) {
            config.temperature = options.temperature;
        }
        if (options.json) {
            config.responseMimeType = "application/json";
        }
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
            contents: contents,
            config: config
        });
        const cleanedResponse = cleanAIResponse(response.text);
        return JSON.parse(cleanedResponse)
    } catch (error) {
        throw new Error(`AI Error: ${error.message}`);
    }
}
function cleanAIResponse(response) {
    let text = response.trim();
    text = text.replace(/^```(?:json)?\s*/i, "");
    text = text.replace(/\s*```$/i, "");
    return text.trim();
}
export default callGemini;
