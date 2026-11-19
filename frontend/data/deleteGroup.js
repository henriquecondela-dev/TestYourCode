import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token = getToken();
export async function deleteGroup(groupId) {
    try {
        const response = await fetch(`${API_URL}/api/groups/${groupId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const res = await response.json();
        if (!response.ok) {
            console.error(`Stastus: ${response.status}`)
            return { error: res.message }
        }
        return res
    } catch (error) {
        console.error("ERRO: was not possible to delete the group", error.message)
        return { error: "The server is not responding. Try again." }
    }
}
