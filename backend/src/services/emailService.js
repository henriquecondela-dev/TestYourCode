import "dotenv/config"

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

export async function getAccessToken() {
    const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: process.env.GMAIL_CLIENT_ID,
            client_secret: process.env.GMAIL_CLIENT_SECRET,
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
            grant_type: "refresh_token"
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Gmail Auth Failed: " + (data.error_description || data.error));
    }
    return data.access_token;
}

function encodeHeader(text) {
    return "=?UTF-8?B?" + Buffer.from(text).toString("base64") + "?=";
}

function buildEmail(to, subject, text) {
    const email = [
        "From: " + encodeHeader(process.env.GMAIL_NAME || "TestYourCode") + " <" + process.env.GMAIL_USER + ">",
        "To: " + to,
        "Subject: " + encodeHeader(subject),
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
        "",
        Buffer.from(text).toString("base64")
    ].join("\r\n");
    return Buffer.from(email).toString("base64url");
}

export async function sendEmail(accessToken, to, subject, text) {
    const response = await fetch(SEND_URL, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            raw: buildEmail(to, subject, text)
        })
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Email not sent");
    }
}
