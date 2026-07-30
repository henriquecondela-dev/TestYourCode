import { challengeDetail } from "../data/challengedetail.js";
import { secondsToHours } from "./timeConverter.js";
import { getChallenge, getToken } from "../data/store.js";
import showMessage from "./messagesAlert.js";
import API_URL from "../config/api_url.js";
import { finishChallenge } from "../data/finishchallenge.js";
const token = getToken();
let id;
const challengedetail = getChallenge();
console.log(challengedetail)
if (challengedetail) {
    id = Number(challengedetail.id);
} else {
    id = Number(sessionStorage.getItem("challengeID"));
}
const challengedetails = await challengeDetail(id)
const timer = document.getElementById("timer");
const timesrInfo = document.getElementById("challenge-timer");
const problem = document.getElementById("problem");
//const pause = document.getElementById("pause-btn");
const play = document.getElementById("play-btn");

let time = secondsToHours(challengedetails.durationSeconds);
let running = false;
let hours = time.hours;
let minutes = time.minutes;
let seconds = time.seconds;

timer.textContent =
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;
play.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/api/challenges/${challengedetails.id}/start`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const submit = await response.json();
        if (!response.ok) {
            showMessage(`${submit.message}`, "challengeAlert", "challege-message");
            console.error(`Stastus: ${response.status}`);
            throw new Error(`${submit.message}`)
        }
        showMessage(`${submit.message}`, "challengeSuccess", "challege-message");
        //return submit.message
    } catch (error) {
        console.error("ERRO: was not possible to start the challenge", error.message)
        return;
    }
    problem.style.color = "hsl(0, 0%, 91%)";
    if (running) return;
    running = true;
    const intervalcheck = setInterval(async () => {
        if (hours === 0 && minutes === 0 && seconds === 0) {
            clearInterval(intervalcheck);
            await finishChallenge(challengedetails.id);
            try {
                const response = await fetch(`${API_URL}/api/challenges/${challengedetails.id}/submissions/all`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const submit = await response.json();
                if (!response.ok) {
                    if (response.status !== 403) {
                        showMessage(`${submit.message}`, "challengeAlert", "challege-message");
                        console.error(`Stastus: ${response.status}`);
                    } throw new Error(`${submit.message}`)
                }
                showMessage(`${submit.message}`, "challengeSuccess", "challege-message");
                //return submit.message
            } catch (error) {
                if (error.message.trim() !== "YOU ARE NOT THE OWNER") {
                    console.error("ERRO: was not possible to submit solution", error.message)
                }
            }
            timesrInfo.style.fontWeight = "800";
            timesrInfo.style.fontSize = "1.8rem";
            timesrInfo.style.fontFamily = "monospace";
            timesrInfo.style.color = " hsl(0, 100%, 57%)";
            timesrInfo.textContent = "Time Expired";
            timer.textContent = "00:00:00";
            currentUser.submitted = true;
            submitButton.disabled = true;
            textarea.disabled = true;
            fileInput.disabled = true;
            running = false;

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
        timer.textContent =
            `${String(hours).padStart(2, "0")}:` +
            `${String(minutes).padStart(2, "0")}:` +
            `${String(seconds).padStart(2, "0")}`;
    }, 1000);
});
/*pause.addEventListener("click", () => {
    clearInterval(intervalcheck);
    timer.classList.remove("timer-ending");
    running = false;
});*/
