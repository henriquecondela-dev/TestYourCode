export function getToken() {
    return localStorage.getItem("token");
}

export function saveChallenge(data) {
    sessionStorage.setItem(
        "challenge",
        JSON.stringify(data)
    );
}
export function getChallenge(){
    const challenge = sessionStorage.getItem("challenge");
    return challenge ? JSON.parse(challenge) : null;
}