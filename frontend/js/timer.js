import { challengeDetail } from "../data/challengedetail.js";
import { getRemainingSeconds, secondsToHours } from "./timeConverter.js";
import { getChallenge, getToken } from "../data/store.js";
import showMessage from "./messagesAlert.js";
import API_URL from "../config/api_url.js";
import { finishChallenge } from "../data/finishchallenge.js";
import { finishAndEvaluate } from "../data/finishAndEvaluate.js";
const token = getToken();
let id;

const challengedetail = getChallenge();
if (challengedetail) {
    id = Number(challengedetail.id);
} else {
    id = Number(sessionStorage.getItem("challengeID"));
}
let challengedetails = await challengeDetail(id);
console.log(challengedetails)
const timer = document.getElementById("timer");
const timesrInfo = document.getElementById("challenge-timer");
const problem = document.getElementById("problem");
const submitButton = document.getElementById("submitSolution-btn");
const fileInput = document.getElementById("file");
const textarea = document.getElementById("code");
//let running = false;
let hours;
let minutes;
let seconds;
let reloaded = true;
problem.style.color = "transparent";
function showProblem() {
    problem.style.color = "hsl(0, 0%, 91%)";
}
function updateTimer() {
    timer.textContent =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
}
function startTimer() {
    const remainingSeconds = getRemainingSeconds(
        challengedetails.startedAt,
        challengedetails.durationSeconds
    );
    const time = secondsToHours(remainingSeconds);
    hours = time.hours;
    minutes = time.minutes;
    seconds = time.seconds;
    updateTimer();
    const intervalcheck = setInterval(async () => {
        if (hours === 0 && minutes === 0 && seconds === 0) {
            console.log("chegou aqui");
            clearInterval(intervalcheck);
            timesrInfo.style.fontWeight = "800";
            timesrInfo.style.fontSize = "16px";
            timesrInfo.style.fontFamily = "monospace";
            timesrInfo.style.color = "hsl(0, 100%, 57%)";
            timesrInfo.textContent = "Time Expired";
            timer.textContent = "00:00:00";
            submitButton.disabled = true;
            textarea.disabled = true;
            fileInput.disabled = true;
            await finishAndEvaluate(
                challengedetails.id,
                token
            );
            sessionStorage.setItem("challengeID", challengeId);
            window.location.href = "../pages/results.html";
            return;
        }
        if (hours === 0 && minutes <= 1 && seconds < 60) {
            timer.classList.add("timer-ending");
        }
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
        }
        updateTimer();
    }, 1000);
     
}
async function startChallenge() {
    try {
        const response = await fetch(
            `${API_URL}/api/challenges/${challengedetails.id}/start`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const submit = await response.json();
        if (!response.ok) {
            if (response.status === 409) {
                showMessage(
                    `Waiting for the owner to start`,
                    "challengeAlert",
                    "challege-message"
                )
            }
            throw new Error(`${submit.message}`);
        }
        challengedetails = await challengeDetail(
            challengedetails.id
        );
        showMessage(
            `${submit.message}`,
            "challengeSuccess",
            "challege-message"
        );
        startTimer();
    } catch (error) {
        console.error(
            "ERRO: was not possible to start the challenge",
            error.message
        );
    }
}
async function initializeChallenge() {
    if (challengedetails.status === "RUNNING") {
        showProblem();
        startTimer();
        return;
    }
    if (challengedetails.status === "READY") {
        problem.style.color = "transparent";
        timer.textContent =
            "Challenge will start in 30 seconds...";
        let countdown = 30;
        const countdownInterval = setInterval(async () => {
            countdown--;
            timer.textContent =
                `Challenge will start in ${countdown} seconds...`;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                await startChallenge();
                challengedetails = await challengeDetail(
                    challengedetails.id
                );
                if (challengedetails.status === "RUNNING") {
                    showProblem();
                    startTimer();
                }
                window.location.reload();
                console.log("fez reload");
            }
        }, 1000);
        return;
    }
    // Caso o challenge esteja em outro estado
    // timesrInfo.textContent =
    // `Challenge status: ${challengedetails.status}`;
    timesrInfo.textContent = `challenge finished, all participants submitted!`;
    timesrInfo.style.fontWeight = "800";
    timesrInfo.style.fontSize = "16px";
    timesrInfo.style.fontFamily = "monospace";
    timesrInfo.style.color = "hsl(0, 100%, 57%)";
}
initializeChallenge();
