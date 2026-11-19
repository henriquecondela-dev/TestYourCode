import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function saveAvatar(data) {
    try {
        const response = await fetch(`${API_URL}/api/users/me/avatar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        const res = await response.json();
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            return { error: res.message }
        }
        return res
    } catch (error) {
        console.error("ERRO: was not possible to save the avatar", error.message)
        return { error: "The server is not responding. Try again." }
    }
}
