import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token=getToken();
export async function getMyGroups() {
    try {
        const response = await fetch(`${API_URL}/api/groups/my`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        const groups = await response.json()
        if (!response.ok) {
             console.error(`Stastus: ${response.status}`)
            throw new Error(`${groups.message}`)
        }
        //console.log(groups.groups[0])
        return groups.groups
    } catch (error) {
        console.error("ERRO: was not possible to get the groups", error.message)
    }
}