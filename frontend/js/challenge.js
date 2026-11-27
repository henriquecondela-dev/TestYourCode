import { challengeDetail } from "../data/challengedetail.js";
import { getParticipants } from "../data/getParticipants.js";
import { getChallenge, getToken } from "../data/store.js";
import { finishChallenge } from "../data/finishchallenge.js";
import API_URL from "../config/api_url.js";
import showMessage from "./messagesAlert.js";
import { createAvatar, fillAvatar } from "./avatar.js";
import { finishAndEvaluate } from "../data/finishAndEvaluate.js";
import { languageName } from "./languages.js";
const token = getToken();
const currentUser = JSON.parse(sessionStorage.getItem("user"));
const upload = document.getElementById("file");
const fileName = document.getElementById("file-name");
const participantContainer = document.getElementById("participants-container");
const fileType = document.getElementById("file-type-btn");
const textType = document.getElementById("text-type-btn");
const textarea = document.getElementById("code");
const bottomSideSubmit= document.querySelector(".bottom-side");
const lineNumbers = document.getElementById("line-numbers");
const fileInput = document.getElementById("file");
const problem = document.getElementById("problem");
const status = document.getElementById("status");
const programlanguage = document.getElementById("progaming-language");
const submitButton = document.getElementById("submitSolution-btn");

let type = null;
let id;
const challengedetail = getChallenge();
console.log(challengedetail)
if (challengedetail) {
    id = Number(challengedetail.id);
} else {
    id = Number(sessionStorage.getItem("challengeID"));
}
const challengeDetails = await challengeDetail(id);
console.log(challengeDetails)
const users = await getParticipants(id);
let solution = "";
//console.log(users)
//console.log(challengeDetails)
//problem.textContent = `${challengeDetails.problem}`
problem.textContent = `${challengeDetails.problem}`
    .replace(/\\n/g, "\n")
    .replace(/&le;/g, "≤")
    .replace(/&ge;/g, "≥")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
programlanguage.textContent = languageName(challengeDetails.language)
document.getElementById("challenge-language").textContent = languageName(challengeDetails.language)
document.getElementById("userName").textContent = currentUser.username;
fillAvatar(document.getElementById("mini-avatar"), currentUser);
loadUsers();
textType.classList.add("active");
textType.addEventListener("click", () => {
    textType.classList.add("active");
    fileType.classList.remove("active");
    bottomSideSubmit.classList.add("off");
    
})
fileType.addEventListener("click", () => {
    fileType.classList.add("active");
    textType.classList.remove("active");
    bottomSideSubmit.classList.toggle("off");
})
submitButton.addEventListener("click", async () => {
    console.log("voce clicou")
    if (fileType.classList.contains("active")) {
        type = "FILE"
        const file = fileInput.files[0];
        if (!file) {
            showMessage("Please, select a file", "challengeAlert", "challege-message");
            return;
        }
        solution = await file.text();
        //console.log(solution)
    } else if (textType.classList.contains("active")) {
        type = "TEXT";
        if (textarea.value.trim() === "") {
            showMessage("Please, provide a valid solution", "challengeAlert", "challege-message");
            return;
        }
        solution = textarea.value;
    }
    if (!type) {
        showMessage("Please, select a solution type first", "challengeAlert", "challege-message");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/challenges/${challengeDetails.id}/submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                type: `${type}`,
                solution: `${solution}`
            })
        })
        const submit = await response.json()
        if (!response.ok) {
            showMessage(`${submit.message}`, "challengeAlert", "challege-message");
            console.error(`Stastus: ${response.status}`);
            throw new Error(`${submit.message}`)
        }
        showMessage(`${submit.message}`, "challengeSuccess", "challege-message");
        //return submit.message
    } catch (error) {
        console.error("ERRO: was not possible to submit solution", error.message)
        return;
    }
    submitButton.textContent = "solution submitted";
    //currentUser.submitted = true;
    submitButton.disabled = true;
    textarea.disabled = true;
    fileInput.disabled = true;
    status.textContent = "SOLUTION SUBMITTED";
    status.style.color = "green";
    sessionStorage.setItem("challengeID", challengeDetails.id);
    document.getElementById("live-results").classList.remove("hidden");
    await loadUsers();
})
const interval = setInterval(async () => {
    const participants = await getParticipants(challengeDetails.id)
    renderParticipants(participants);
    const allSubmitted = participants.every(user =>
        user.submissions.length > 0 &&
        user.submissions[0].submitted
    );
    if (allSubmitted) {
        //await finishChallenge(challengeDetails.id);
        clearInterval(interval);
        renderParticipants(participants);
        document.getElementById("challenge-timer").style.fontWeight = "800";
        document.getElementById("challenge-timer").style.fontSize = "16px";
        document.getElementById("challenge-timer").style.fontFamily = "monospace";
        document.getElementById("challenge-timer").style.color = "hsl(0, 100%, 57%)";
        document.getElementById("challenge-timer").textContent = "All solutions submitted. Evaluating...";
        sessionStorage.setItem("challengeID", challengeDetails.id);
        await finishAndEvaluate(challengeDetails.id);
    }
    //console.log("not yet")
}, 10000);
async function loadUsers() {
    const participants = await getParticipants(challengeDetails.id);
    renderParticipants(participants);
} 
function renderParticipants(participants) {
    participantContainer.innerHTML = "";
    if (participants.length === 0) {
        participantContainer.textContent = "No users yet";
        return;
    }
    participants.forEach((user) => {
        const card = document.createElement("div");
        card.classList.add("participant-card");
        card.appendChild(createAvatar(user, "card-avatar"));
        card.appendChild(document.createTextNode(user.username));
        card.style.fontSize = "12px";
        const submitted =
            user.submissions.length > 0 &&
            user.submissions[0].submitted;
        if (submitted) {
            card.classList.add("submitted");
            
        }
        participantContainer.appendChild(card);
    });
}
upload.addEventListener("change", () => {
    fileName.textContent = upload.files[0]?.name || "No file";
    if (upload.files[0]) {
        fileType.classList.add("active");
        textType.classList.remove("active");
    }
});
const PAIRS = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'", "`": "`" };
textarea.addEventListener("input", updateLines);
textarea.addEventListener("keydown", (event) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = textarea.value[start];
    if (event.key === "Tab") {
        event.preventDefault();
        textarea.setRangeText("    ", start, end, "end");
        return;
    }
    if (event.key === "Backspace" && start === end && PAIRS[textarea.value[start - 1]] === next) {
        event.preventDefault();
        textarea.setRangeText("", start - 1, start + 1, "end");
        updateLines();
        return;
    }
    if (start === end && next === event.key && Object.values(PAIRS).includes(event.key)) {
        event.preventDefault();
        textarea.setSelectionRange(start + 1, start + 1);
        return;
    }
    const canClose = next === undefined || /[\s)\]};,]/.test(next);
    if (PAIRS[event.key] && (canClose || start !== end)) {
        event.preventDefault();
        const selected = textarea.value.slice(start, end);
        textarea.setRangeText(event.key + selected + PAIRS[event.key], start, end, "end");
        textarea.setSelectionRange(start + 1, start + 1 + selected.length);
        updateLines();
    }
});
textarea.addEventListener(
    "scroll", () => {
        lineNumbers.scrollTop = textarea.scrollTop;
    }
);
textarea.addEventListener("paste", (event) => {
    event.preventDefault();
    showMessage("Paste is not allowed. Write your own code.", "challengeAlert", "challege-message");
});
textarea.addEventListener("drop", (event) => {
    event.preventDefault();
    showMessage("Drop is not allowed. Write your own code.", "challengeAlert", "challege-message");
});
function updateLines() {
    const totalLines = textarea.value.split("\n").length;
    let numbers = "";
    for (let i = 1; i <= totalLines; i++) {
        numbers += i + "\n";
    }
    //console.log(numbers);
    lineNumbers.innerHTML = numbers;
}
updateLines();
let retried = false;
async function retryEvaluation() {
    try {
        await fetch(`${API_URL}/api/challenges/${challengeDetails.id}/submissions/all`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("ERRO: was not possible to evaluate again", error.message);
    }
}
const Interval = setInterval(async () => {
        try {
            const response = await fetch(`${API_URL}/api/challenges/${challengeDetails.id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const challenge = await response.json();
            if (!response.ok) {
                console.error("Could not check challenge:", challenge.message);
                return;
            }
            console.log("Challenge status:", challenge.challenge.status);
            if (challenge.challenge.status === "FINISHED" && !retried) {
                retried = true;
                await retryEvaluation();
                return;
            }
            if (challenge.challenge.status === "COMPLETED") {
                clearInterval(Interval);
                sessionStorage.setItem("challengeID", challengeDetails.id);
                window.location.href = "../pages/results.html";
                return;
            }
        } catch (error) {
            console.error("Error checking challenge status:", error.message);
        }
    }, 2000);
