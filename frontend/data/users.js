import { getToken } from "./store.js";
import API_URL from "../config/api_url.js";
const token=getToken();
export async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/api/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }})
        const users = await response.json();
        if (!response.ok){
            console.error(`Stastus: ${response.status}`)
            throw new Error(`${users.message}`)
        }return users.users
    } catch (error) {
        console.error("ERRO: was not possible to get the users", error.message)
    }
}