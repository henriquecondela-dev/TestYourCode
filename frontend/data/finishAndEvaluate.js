import { finishChallenge } from "./finishchallenge.js";
import API_URL from "../config/api_url.js";
let evaluationStarted = false;
export async function finishAndEvaluate(challengeId, token) {
    if (evaluationStarted) {
        console.log("Evaluation already started");
        return;
    }
    evaluationStarted = true;
    try {
        await finishChallenge(challengeId);
        const response = await fetch(
            `${API_URL}/api/challenges/${challengeId}/submissions/all`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const submit = await response.json();
        if (!response.ok) {
            throw new Error(submit.message);
        }
        console.log("Challenge evaluation started");
        return submit;
    } catch (error) {
        console.error(
            "Error finishing/evaluating challenge:",
            error.message
        );
        evaluationStarted = false;
        throw error;
    }
}