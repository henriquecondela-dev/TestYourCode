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
        console.log(response.text)
        const cleanedResponse=cleanAIResponse(response.text);
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