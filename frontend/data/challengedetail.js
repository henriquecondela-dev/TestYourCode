import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token=getToken();
export async function challengeDetail(challengeID) {
    challengeID=Number(challengeID);
    try {
        const response = await fetch(`${API_URL}/api/challenges/${challengeID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const challenge = await response.json();
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            throw new Error(`${challenge.message}`)
        }
        return challenge.challenge;
    } catch (error) {
        console.error("ERRO: was not possible to get ", error.message)
    }
}