import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
async function callGroq(prompt) {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });
        console.log(response.choices[0].message.content)
        const cleanedResponse=cleanAIResponse(response.choices[0].message.content);
        return JSON.parse(cleanedResponse
        );
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
export default callGroq;