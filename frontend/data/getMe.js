import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function getMe() {
    try {
        const response = await fetch(`${API_URL}/api/users/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const user = await response.json();
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            throw new Error(`${user.message}`)
        }
        return user
    } catch (error) {
        console.error("ERRO: was not possible to get your profile", error.message)
    }
}
