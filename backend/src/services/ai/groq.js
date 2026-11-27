import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
function toMessages(input) {
    if (typeof input === "string") {
        return [{ role: "user", content: input }];
    }
    return [
        { role: "system", content: input.system },
        { role: "user", content: input.user }
    ];
}
async function callGroq(input, options = {}) {
    try {
        const request = {
            model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
            messages: toMessages(input)
        };
        if (options.temperature !== undefined) {
            request.temperature = options.temperature;
        }
        if (options.json) {
            request.response_format = { type: "json_object" };
        }
        const response = await groq.chat.completions.create(request);
        const cleanedResponse = cleanAIResponse(response.choices[0].message.content);
        return JSON.parse(cleanedResponse);
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
