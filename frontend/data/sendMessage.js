import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function sendMessage(content) {
    try {
        const response = await fetch(`${API_URL}/api/chat/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                content: content
            })
        })
        const message = await response.json();
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            throw new Error(`${message.message}`)
        }
        return message.message
    } catch (error) {
        console.error("ERRO: was not possible to send the message", error.message)
    }
}
