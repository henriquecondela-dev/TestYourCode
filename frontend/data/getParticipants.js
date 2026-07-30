import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function getParticipants(challengeid) {
    try {
        const response = await fetch(`${API_URL}/api/challenges/${challengeid}/participants`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const participants = await response.json();
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            throw new Error(`internal server error`)
        }//console.log(participants.participants) 
        return participants.participants
    } catch (error) {
        console.error("ERRO: was not possible to get participantas", error.message)
    }
}