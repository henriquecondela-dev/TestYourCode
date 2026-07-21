import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
// Create a single client object
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function callGemini(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });
        return JSON.parse(response.text)
    } catch (error) {
        throw new Error(`AI Error: ${error.message}`);
    }
}
export default callGemini;