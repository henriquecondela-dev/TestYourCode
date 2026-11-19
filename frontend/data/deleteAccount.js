import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function deleteAccount(data) {
    try {
        const response = await fetch(`${API_URL}/api/users/me`, {
            method: "DELETE",
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
        console.error("ERRO: was not possible to delete the account", error.message)
        return { error: "The server is not responding. Try again." }
    }
}
