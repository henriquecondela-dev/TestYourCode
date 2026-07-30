import { challengeDetail } from "../data/challengedetail.js";
import { getParticipants } from "../data/getParticipants.js";
import { getChallenge, getToken } from "../data/store.js";
import { finishChallenge } from "../data/finishchallenge.js";
import API_URL from "../config/api_url.js";
import showMessage from "./messagesAlert.js";
const token = getToken();
const currentUser = JSON.parse(localStorage.getItem("user"));
const upload = document.getElementById("file");
const fileName = document.getElementById("file-name");
const participantContainer = document.getElementById("participants-container");
const fileType = document.getElementById("file-type-btn");
const textType = document.getElementById("text-type-btn");
const textarea = document.getElementById("code");
const lineNumbers = document.getElementById("line-numbers");
const fileInput = document.getElementById("file");
const problem = document.getElementById("problem");
const status = document.getElementById("status");
const programlanguage = document.getElementById("progaming-language");
const submitButton = document.getElementById("submitSolution-btn");
/*const users = [
    {
        id: 1,
        username: "Henrique",
        submitted: false,
        solution: null
    },
    {
        id: 2,
        username: "Simiao",
        submitted: true,
        solution: {
            type: "text",
            content: "Hello ever one"
        }
    },
    {
        id: 3,
        username: "Antonio",
        submitted: true,
        solution: {
            type: "text",
            content: "Hello ever one"
        }
    }, {
        id: 4,
        username: "pedro",
        submitted: true,
        solution: {
            type: "text",
            content: "Hello ever one"
        }
    }, {
        id: 5,
        username: "Ana cristia",
        submitted: true,
        solution: {
            type: "text",
            content: "Hello ever one"
        }
    },
    {
        id: 3,
        username: "Antonio",
        submitted: true,
        solution: {
            type: "text",
            content: "Hello ever one"
        }
    },
    {
        id: 3,
        username: "Antonio",
        submitted: false,
        solution: {
            type: "text",
            content: "Hello ever one"
        }
    },
    {
        id: 3,
        username: "Andrea",
        submitted: false,
        solution: {
            type: "text",
            content: "Hello ever one"
        }
    }
];
*/
//const challengeDetails = getChallenge();
/*if(!challengeDetails){
    
}*/
let type = null;
let id;
const challengedetail = getChallenge();
console.log(challengedetail)
if (challengedetail) {
    id = Number(challengedetail.id);
} else {
    id = Number(sessionStorage.getItem("challengeID"));
}
const challengeDetails = await challengeDetail(id)
const users = await getParticipants(id);
let solution = "";
//console.log(users)
//console.log(challengeDetails)
problem.textContent = `${challengeDetails.problem}`
problem.style.color = "hsl(0, 0% ,18%)"
programlanguage.textContent = `${challengeDetails.language}`
document.getElementById("challenge-language").textContent = `${challengeDetails.language}`
document.getElementById("userName").textContent = currentUser.username;
loadUsers();
textType.addEventListener("click", () => {
    textType.classList.add("active");
    fileType.classList.remove("active");
})
fileType.addEventListener("click", () => {
    fileType.classList.add("active");
    textType.classList.remove("active");
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
    loadUsers();
})
const interval = setInterval(async () => {
    const participants = await getParticipants(challengeDetails.id)
    const allSubmitted = participants.every(user =>
        user.submissions.length > 0 &&
        user.submissions[0].submitted
    );
    if (allSubmitted) {
        await finishChallenge(challengeDetails.id);
        clearInterval(interval);
        try {
            const response = await fetch(`${API_URL}/api/challenges/${challengeDetails.id}/submissions/all`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const submit = await response.json()
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
    }
    //console.log("not yet")
}, 10000);

function loadUsers() {
    if (users.length === 0) {
        participantContainer.innerHTML = "<p>No user yet</p>";
    } else {
        users.forEach((user) => {
            const card = document.createElement("div");
            card.classList.add("participant-card");
            card.textContent = user.username;
            card.style.fontSize = "12px";
            if (user.submissions.length > 0 && user.submissions[0].submitted) {
                card.classList.add("submitted");
            }
            participantContainer.appendChild(card);
        })
    }
}
upload.addEventListener("change", () => {
    fileName.textContent = upload.files[0]?.name || "No file";
});

textarea.addEventListener("input", () => {
    updateLines();
    const lastChar = textarea.value[textarea.value.length - 1];
    if (lastChar === "{") {
        textarea.value += "}";
    } else if (lastChar === "(") {
        textarea.value += ")";
    } else if (lastChar === "[") {
        textarea.value += "]";
    } else if (lastChar === `"`) {
        textarea.value += `"`;
    } else if (lastChar === "`") {
        textarea.value += "`";
    }
}
);
textarea.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
        event.preventDefault();
        textarea.setRangeText(
            "     ",
            textarea.selectionStart,
            textarea.selectionEnd,
            "end"
        );
    }
});
textarea.addEventListener(
    "scroll", () => {
        lineNumbers.scrollTop = textarea.scrollTop;
    }
);
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

