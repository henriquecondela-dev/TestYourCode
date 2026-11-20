import { finishChallenge } from "./finishchallenge.js";
let evaluationStarted = false;
export async function finishAndEvaluate(challengeId) {
    if (evaluationStarted) {
        return;
    }
    evaluationStarted = true;
    await finishChallenge(challengeId);
}
