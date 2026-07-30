import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function finishChallenge(challengeID) {
    challengeID = Number(challengeID);
    try {
        const response = await fetch(`${API_URL}/api/challenges/${challengeID}/finish`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const challenge = await response.json();
        if (!response.ok) {
            if (response.status !== 403) {
                console.error(`Stastus: ${response.status}`);
            } throw new Error(`${challenge.message}`)
        }
        return challenge.message;
    } catch (error) {
        if (error.message.trim() !== "YOU ARE NOT THE OWNER") {
            console.error("ERRO: was not possible to get the groups", error.message)
        }
    }
}