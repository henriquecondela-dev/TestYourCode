import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token=getToken();
export async function createGroup(name) {
    try {
        const response = await fetch(`${API_URL}/api/groups`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify({
                name: `${name}`
            })
        })
        const group = await response.json()
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            throw new Error(`${group.message}`)
        }
        return group.message
    } catch (error) {
        console.error("ERRO: was not possible to get the groups", error.message)
    }
}
