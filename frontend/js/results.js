import API_URL from "../config/api_url.js";
import { getResults } from "../data/getResults.js";
import { getGroups } from "../data/groups.js";
import { getToken } from "../data/store.js";
import { createAvatar, fillAvatar } from "./avatar.js";
const token = getToken();
if (!token) {
    window.location.href = "../pages/login.html"
}
const username = document.getElementById("userName");
const user = JSON.parse(sessionStorage.getItem("user"));
username.textContent = user.username;
fillAvatar(document.getElementById("mini-avatar"), user);
const groupsContainer = document.getElementById("groups-container");
const rankContainer = document.getElementById("ranking-container");
const firstPosition = document.getElementById("rank_1");
const secondPosition = document.getElementById("rank_2");
const thirdPosition = document.getElementById("rank_3");
let firstName = document.getElementById("first-name");
let secondName = document.getElementById("second-name");
let thirdName = document.getElementById("third-name");
let firstScore = document.getElementById("first-score");
let secondScore = document.getElementById("second-score");
let thirdScore = document.getElementById("third-score");
const groupsBtn = document.getElementById("groups-btn");
const groupsNav = document.querySelector(".nav-bar");
const groups = await getGroups();

let selectedChallenge = null;
let selectedGroup = null;
selectedChallenge = sessionStorage.getItem("challengeID");
if (selectedChallenge != null) {
    let results = await getResults(selectedChallenge);
    placePositions(results);

}/*else {
    const data = [
        {
            userId: 9,
            username: "Ana Cristina",
            rank: 1,
            score: 92,
            feedback: "Excelente solução. Código correto e bem estruturado.",
            approved: true
        },
        {
            userId: 18,
            username: "Daniel Ernesto",
            rank: 2,
            score: 88,
            feedback: "Boa solução. Todos os principais casos foram resolvidos.",
            approved: true
        },
        {
            userId: 7,
            username: "Carlos Manuel",
            rank: 3,
            score: 85,
            feedback: "Solução correta e eficiente.",
            approved: true
        },
        {
            userId: 12,
            username: "Maria Isabel",
            rank: 4,
            score: 78,
            feedback: "Solução correta, mas pode ser otimizada.",
            approved: true
        },
        {
            userId: 4,
            username: "José Alberto",
            rank: 5,
            score: 71,
            feedback: "Solução válida, porém apresenta algumas ineficiências.",
            approved: true
        },
        {
            userId: 5,
            username: "Pedro Lucas",
            rank: 6,
            score: 65,
            feedback: "A solução apresenta alguns problemas de lógica.",
            approved: false
        },
        {
            userId: 15,
            username: "Mateus João",
            rank: 7,
            score: 54,
            feedback: "A solução não cobre todos os casos de teste.",
            approved: false
        },
        {
            userId: 11,
            username: "Sofia Mendes",
            rank: 8,
            score: 43,
            feedback: "Código contém erros que impedem a execução correta.",
            approved: false
        },
        {
            userId: 3,
            username: "Antonio Nuvunga",
            rank: 9,
            score: 0,
            feedback: "Código não é uma solução válida em Java.",
            approved: false
        },
        {
            userId: 1,
            username: "Junior Henrique",
            rank: 10,
            score: 0,
            feedback: "Código não é uma solução válida em Java.",
            approved: false
        }
    ];
    placePositions(data);
}*/
groupsBtn.addEventListener("click", () => {
    groupsNav.classList.toggle("show");
});
loadGroups();
async function loadGroups() {
    if (groups.length === 0) {
        groupsContainer.innerHTML = "No groups available yet.";
        groupsContainer.style.textAlign = "center";
    } else {
        groups.forEach((group) => {
            const card = document.createElement("div");
            card.classList.add("group-card");
            card.textContent = group.name;
            card.style.fontSize = "14px";
            card.style.fontWeight = "bold";
            card.addEventListener("click", async () => {
                selectedChallenge = null;
                selectedGroup = null;
                document.querySelectorAll(".group-card").forEach(card => {
                    card.classList.remove("selected-group");
                    const list = card.querySelector(".challenge-list");
                    if (list) {
                        list.remove();
                    }
                });
                card.classList.add("selected-group");
                selectedGroup = group.id;
                console.log("selected group", selectedGroup);
                const response = await fetch(
                    `${API_URL}/api/groups/${group.id}/challenges`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                const data = await response.json();
                const challenges = data.challenges.filter(
                    challenge => challenge.status === "COMPLETED"
                );
                const list = document.createElement("div");
                list.classList.add("challenge-list");
                challenges.forEach(challenge => {
                    const item = document.createElement("div");
                    item.classList.add("challenge-card");
                    item.classList.add(
                        `challenge-${challenge.status.toLowerCase()}`
                    );
                    item.textContent =
                        `${challenge.title}`;
                    item.addEventListener("click", async (e) => {
                        document
                            .querySelectorAll(".challenge-card")
                            .forEach(element => {
                                element.classList.remove("selected");
                            });
                        item.classList.add("selected");
                        e.stopPropagation();
                        selectedChallenge = challenge.id;
                        let results = await getResults(selectedChallenge);
                        placePositions(results)
                    });
                    list.appendChild(item);
                });
                card.appendChild(list);
            });
            groupsContainer.appendChild(card);
        })
    }
}
function placePositions(results) {
    document.querySelectorAll(".rank-result, .rank-empty").forEach(element => element.remove());
    const podium = [
        { box: firstPosition, name: firstName, score: firstScore, avatar: "first-avatar" },
        { box: secondPosition, name: secondName, score: secondScore, avatar: "second-avatar" },
        { box: thirdPosition, name: thirdName, score: thirdScore, avatar: "third-avatar" }
    ];
    podium.forEach((place, index) => {
        const result = results?.[index];
        if (!result) {
            place.box.style.visibility = "hidden";
            return;
        }
        place.box.style.visibility = "visible";
        place.name.textContent = index === 0 ? result.username : result.username.split(" ")[0];
        place.score.textContent = `${result.score} pts`;
        fillAvatar(document.getElementById(place.avatar), result);
    });
    if (!results || results.length === 0) {
        const empty = document.createElement("p");
        empty.classList.add("rank-empty");
        empty.textContent = "Nobody submitted a solution in this challenge.";
        rankContainer.appendChild(empty);
        return;
    }
    const hint = document.createElement("p");
    hint.classList.add("rank-empty");
    hint.textContent = "Click a name to see what the AI said about the solution.";
    rankContainer.appendChild(hint);
    results.forEach((result) => {
        const card = document.createElement("div");
        const left = document.createElement("div");
        const right = document.createElement("div");
        const position = document.createElement("span");
        const name = document.createElement("span");
        const feedback = document.createElement("p");
        const icon = createAvatar(result, "others-icon");
        card.classList.add("rank-result");
        left.classList.add("descrip");
        right.classList.add("others-score");
        name.classList.add("participantName");
        position.classList.add("others-position");
        feedback.classList.add("rank-feedback");
        position.textContent = `${result.rank}`;
        name.textContent = `${result.username}`;
        right.textContent = `${result.score} pts`;
        feedback.textContent = `${result.approved ? "Approved" : "Not approved"} · ${result.feedback || "No feedback"}`;
        left.appendChild(position);
        left.appendChild(icon)
        left.appendChild(name);
        card.appendChild(left);
        card.appendChild(right);
        card.appendChild(feedback);
        card.addEventListener("click", () => {
            card.classList.toggle("open");
        });
        rankContainer.appendChild(card);
    });
}
