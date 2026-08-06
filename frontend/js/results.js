import API_URL from "../config/api_url.js";
import { getResults } from "../data/getResults.js";
import { getGroups } from "../data/groups.js";
import { getToken } from "../data/store.js";
const token = getToken();
if (!token) {
    window.location.href = "../pages/login.html"
}
const username = document.getElementById("userName");
const user = JSON.parse(sessionStorage.getItem("user"));
username.textContent = user.username;
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
        groupsContainer.innerHTML = "No groups availible yet.";
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
                    challenge =>
                        challenge.status === "FINISHED" ||
                        challenge.status === "COMPLETED"
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
    if (results.length == 2) {
        firstName.textContent = `${results[0].username.split(" ")[0]}`;
        firstScore.textContent = `${results[0].score} pts`;
        secondName.textContent = `${results[1].username.split(" ")[0]}`;
        secondScore.textContent = `${results[1].score} pts`;
        thirdPosition.style.display = "none"

    }
    else if (results.length >= 3) {
        firstName.textContent = `${results[0].username}`;
        firstScore.textContent = `${results[0].score} pts`;
        secondName.textContent = `${results[1].username.split(" ")[0]}`;
        secondScore.textContent = `${results[1].score} pts`;
        thirdName.textContent = `${results[2].username.split(" ")[0]}`;
        thirdScore.textContent = `${results[2].score} pts`;
        let otherResults = results.slice(3);
        document
            .querySelectorAll(".rank-result")
            .forEach((element) => {
                element.remove();
            })
        otherResults.forEach((result) => {
            const card = document.createElement("div");
            const left = document.createElement("div");
            const right = document.createElement("div");
            const position = document.createElement("span");
            const name = document.createElement("span");
            const icon = document.createElement("span");
            card.classList.add("rank-result");
            left.classList.add("descrip");
            right.classList.add("others-score");
            name.classList.add("participantName");
            position.classList.add("others-position");
            icon.classList.add("others-icon")
            position.textContent = `${result.rank}`;
            name.textContent = `${result.username}`;
            right.textContent = `${result.score} pts`;
            left.appendChild(position);
            left.appendChild(icon)
            left.appendChild(name);
            card.appendChild(left);
            card.appendChild(right);
            rankContainer.appendChild(card);
        });
    }
}