import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function getResults(challengeid) {
    try {
        const response = await fetch(`${API_URL}/api/challenges/${challengeid}/result`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const results = await response.json();
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            throw new Error(`internal server error`)
        }console.log(results.results); 
        return results.results;
    } catch (error) {
        console.error("ERRO: was not possible to get results", error.message)
    }
}