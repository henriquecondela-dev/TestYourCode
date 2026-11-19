import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function syncChat(after) {
    try {
        const response = await fetch(`${API_URL}/api/chat/sync?after=${after}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const chat = await response.json();
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            throw new Error(`${chat.message}`)
        }
        return chat
    } catch (error) {
        console.error("ERRO: was not possible to sync the chat", error.message)
    }
}
