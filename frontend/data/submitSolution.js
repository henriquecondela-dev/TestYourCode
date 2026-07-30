import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function submitSolution(challengeId,type,solution) {
    challengeId=Number(challengeId);
    try {
        const response = await fetch(`${API_URL}/api/challenges/${challengeId}/submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                type: `${toUpperCase(type)}`,
                solution: `${solution}`
            })
        })
        const submit = await response.json()
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            throw new Error(`${submit.message}`)
        }
        return submit.message
    } catch (error) {
        console.error("ERRO: was not possible to get the groups", error.message)
    }
}
