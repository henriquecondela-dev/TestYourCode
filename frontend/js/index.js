import { getParticipants } from "../data/getParticipants.js";
import { getGroups } from "../data/groups.js";
import { getMyGroups } from "../data/mygroups.js";
import { getToken, saveChallenge } from "../data/store.js";
import { getUsers } from "../data/users.js";
import API_URL from "../config/api_url.js";

sessionStorage.removeItem("challenge");
sessionStorage.removeItem("challengeID");
const token = getToken();
if (!token) {
    window.location.href = "../pages/login.html"
}
import showMessage from "./messagesAlert.js";
import { createAvatar, fillAvatar } from "./avatar.js";
import { hoursToSeconds, secondsToHours } from "./timeConverter.js";
import { challengeDetail } from "../data/challengedetail.js";
import { languageName } from "./languages.js";
//left side consts
const leftSide = document.querySelector(".left-side");
const button = document.getElementById("state-btn");
//creat group consts
const creatgroupBtn = document.getElementById("creatGrup-btn");
const createGroup = document.getElementById("creatgroup-btn");
const cancelG = document.getElementById("creat-cancel-btn");
const overlayG = document.getElementById("creat-overlay");
const groupName = document.getElementById("creatGroup-name")
let generated = false;
//Join a groput consts
const joinButton = document.getElementById("joinGroup-btn");
const overlayJ = document.getElementById("join-overlay");
const groupsContainer = document.getElementById("groups-container");
const cancelJ = document.getElementById("join-cancel-btn");
let selectedGroup = null;
let selectedChallenge = null;
let selectedStatus = null;
let waitInterval = null;
let statusInterval = null;
let ownerSelectedChallenge = null;
let ownerSelectedGroup = null;
let ownerSelectedGroupName = "";
//start a challenge consts
const startChallengebutton = document.getElementById("startGroup-btn")
const next1Btn = document.getElementById("next1-btn");
const next2Btn = document.getElementById("next2-btn");
const back1Btn = document.getElementById("back1-btn");
const back2Btn = document.getElementById("back2-btn");
const overlaygetout = document.getElementById("wait-overlay")
const overlayS = document.getElementById("start-overlay");
const startchallenge = document.getElementById("start-selected-btn");
const cancelS1 = document.getElementById("start-cancel-btn1");
const cancelS2 = document.getElementById("start-cancel-btn2");
const cancelS3 = document.getElementById("start-cancel-btn3");
const cancelJ1 = document.getElementById("join-cancel-btn1");
const cancelgetOut = document.getElementById("getOut-btn");
const goInChallengeBtn = document.getElementById("go-in-chalenge-btn");
const ownerGroupsContainer = document.getElementById("owner-groups-container");
const startModal3 = document.getElementById("start-summary-modal");
const startModal2 = document.getElementById("start-settings-modal");
const startModal1 = document.getElementById("start-modal");

const Nparticipants = document.getElementById("NOfPartipants");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const difficulty = document.getElementById("difficulty");
const language = document.getElementById("language");
const category = document.getElementById("category");

const spinner = document.getElementById("spinner-icon");
const genarateProblemBtn = document.getElementById("generateProblem-btn");
const username = document.getElementById("userName");
const waitparticipantContainer = document.getElementById("wait-participants-container");

const waitTimer = document.getElementById("wait-timer");

export const user = JSON.parse(sessionStorage.getItem("user"));
username.textContent = user.username;
fillAvatar(document.getElementById("mini-avatar"), user);
setTimeout(function () {
    showMessage(`Welcome back, ${user.username}`, "success", "message-box")
}, 2000)
button.addEventListener("click", function () {
    leftSide.classList.toggle("collapsed");
    //console.log(leftSide.className);
});
creatgroupBtn.addEventListener("click", function () {
    overlayG.style.display = "flex";
});
joinButton.addEventListener("click", async function () {
    groupsContainer.textContent = "";
    await loadGroups();
    overlayJ.style.display = "flex";
});
startChallengebutton.addEventListener("click", async function () {
    ownerGroupsContainer.textContent = "";
    await loadOwnerGroups();
    overlayS.style.display = "flex";
    startModal1.classList.add("active");
    startModal2.classList.remove("active");
    startModal3.classList.remove("active");
    genarateProblemBtn.classList.remove("genarated");
    enable(genarateProblemBtn);
    enable(document.getElementById("difficulty"));
    enable(document.getElementById("language"));
    enable(document.getElementById("category"));
    document.getElementById("textProblem").style.display = "block";
    document.getElementById("textProblem").textContent = "Generate Problem";
    ownerGroupsContainer.classList.remove("disable");

});
genarateProblemBtn.addEventListener("click", async () => {
    if (ownerSelectedGroup === null) {
        showMessage("Please select a group first", "error", "startMessageAlert");
        return;
    }
    generated = false;
    selectedChallenge = null;
    const durationsSeconds = hoursToSeconds(hours.value, minutes.value, seconds.value);
    document.getElementById("textProblem").style.display = "none";
    genarateProblemBtn.classList.add("spinning")
    spinner.style.display = "block";
    try {
        const response = await fetch(`${API_URL}/api/challenges`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                groupId: `${ownerSelectedGroup}`,
                difficulty: `${difficulty.value}`,
                category: `${category.value}`,
                durationSeconds: durationsSeconds,
                language: `${language.value}`
            })
        })
        const challenge = await response.json()
        if (!response.ok) {
            showMessage(`${challenge.message}`, "error", "startMessageAlert")
            document.getElementById("textProblem").style.display = "block";
            genarateProblemBtn.classList.remove("spinning");
            spinner.style.display = "none";
            return;
        }
        showMessage(`${challenge.message}`, "success", "startMessageAlert")
        document.getElementById("summary").innerHTML = `
        <p>Group: ${ownerSelectedGroupName}</p>
        <p>Title: ${challenge.challenge.title}</p>
        <p>Click START to start the challenge</p>`
        //sessionStorage.setItem("challenge",JSON.stringify(challenge.challenge));
        sessionStorage.setItem("challengeID", challenge.challenge.id);
        selectedChallenge = challenge.challenge.id;
        saveChallenge(challenge.challenge);

        //console.log(challenge.challenge);
    } catch (error) {
        console.error("ERRO: was not possible to generate the problem", error.message)
        showMessage("The server is not responding. Try again.", "error", "startMessageAlert");
        document.getElementById("textProblem").style.display = "block";
        genarateProblemBtn.classList.remove("spinning");
        spinner.style.display = "none";
        return;
    }
    genarateProblemBtn.classList.add("genarated");
    disable(genarateProblemBtn);
    disable(document.getElementById("difficulty"));
    disable(document.getElementById("language"));
    disable(document.getElementById("category"));
    document.getElementById("textProblem").style.display = "block";
    document.getElementById("textProblem").textContent = "Problem Generated";
    spinner.style.display = "none";
    ownerGroupsContainer.classList.add("disable");

});

goInChallengeBtn.addEventListener("click", async function () {
    if (selectedGroup === null) {
        showMessage("Please select a group first", "error", "joinMessage");
        return;
    }
    const inGroup = await joinGroup(selectedGroup);
    if (!inGroup) return;
    if (selectedChallenge === null) {
        showMessage("You are in the group. Now pick a challenge", "success", "joinMessage");
        return;
    }
    sessionStorage.setItem("challengeID", selectedChallenge);
    if (selectedStatus === "COMPLETED") {
        window.location.href = "results.html";
        return;
    }
    const inChallenge = await joinChallenge(selectedChallenge);
    if (!inChallenge) return;
    if (selectedStatus === "RUNNING") {
        window.location.href = "challenge.html";
        return;
    }
    waitForStart();
})
cancelgetOut.addEventListener("click", () => {
    clearInterval(waitInterval);
    clearInterval(statusInterval);
    overlaygetout.style.display = "none";
    waitTimer.textContent = "00:00:00";
})
async function joinGroup(groupId) {
    try {
        const response = await fetch(`${API_URL}/api/groups/${groupId}/join`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await response.json();
        if (!response.ok && response.status !== 409) {
            showMessage(`${data.message}`, "error", "joinMessage");
            return false;
        }
        return true;
    } catch (error) {
        console.error("ERRO: was not possible to join the group", error.message);
        showMessage("The server is not responding. Try again.", "error", "joinMessage");
        return false;
    }
}
async function joinChallenge(challengeId) {
    try {
        const response = await fetch(`${API_URL}/api/challenges/${challengeId}/join`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok && data.message !== "Already participating") {
            showMessage(`${data.message}`, "error", "joinMessage");
            return false;
        }
        return true;
    } catch (error) {
        console.error("ERRO: was not possible to join the challenge", error.message);
        showMessage("The server is not responding. Try again.", "error", "joinMessage");
        return false;
    }
}
async function waitForStart() {
    document.getElementById("wait-title").textContent = "Waiting for the owner to start...";
    await loadParticipants(selectedChallenge);
    overlaygetout.style.display = "block";
    let waitSeconds = 0;
    clearInterval(waitInterval);
    clearInterval(statusInterval);
    waitInterval = setInterval(() => {
        waitSeconds++;
        const time = secondsToHours(waitSeconds);
        waitTimer.textContent =
            `${String(time.hours).padStart(2, "0")}:` +
            `${String(time.minutes).padStart(2, "0")}:` +
            `${String(time.seconds).padStart(2, "0")}`;
    }, 1000);
    statusInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_URL}/api/challenges/${selectedChallenge}`, {
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
            const status = challenge.challenge.status;
            if (status === "RUNNING") {
                clearInterval(waitInterval);
                clearInterval(statusInterval);
                window.location.href = "challenge.html";
            } else if (status === "READY") {
                await loadParticipants(selectedChallenge);
            } else {
                clearInterval(waitInterval);
                clearInterval(statusInterval);
                document.getElementById("wait-title").textContent = "Challenge finished";
            }
        } catch (error) {
            console.error("Error checking challenge status:", error.message);
        }
    }, 2000);
}
createGroup.addEventListener("click", async () => {
    if (groupName.value.trim() === "") {
        showMessage("Please write a name for the group", "error", "message-box-create");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/groups`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: `${groupName.value}`
            })
        })
        const group = await response.json()
        if (!response.ok) {
            showMessage(`${group.message}`, "error", "message-box-create")
            //console.error(`Stastus: ${response.status}, message:${group.message}`)
            throw new Error("")
        }
        showMessage(`${group.message}`, "success", "message-box")
        groupName.value = "";
        overlayG.style.display = "none";
    } catch (error) {
        console.error("ERRO: was not possible to create the group", error.message)
        if (error.message !== "") {
            showMessage("The server is not responding. Try again.", "error", "message-box-create");
        }
    }
})
closeModal(cancelG, overlayG);
closeModal(cancelJ1, overlayJ);
closeModal(cancelS1, overlayS);
closeModal(cancelS2, overlayS);
closeModal(cancelS3, overlayS);
//closeModal(cancelgetOut, overlaygetout)
next1Btn.addEventListener("click", () => {
    if (ownerSelectedGroup === null) {
        showMessage("Please select a group first", "error", "startMessageAlert");
        return;
    }
    startModal1.classList.remove("active");
    startModal2.classList.add("active");
});
next2Btn.addEventListener("click", () => {
    if (selectedChallenge === null) {
        showMessage("Please generate the problem first", "error", "startMessageAlert");
        return;
    }
    startModal2.classList.remove("active");
    startModal3.classList.add("active");
});
moveModalForward(back1Btn, startModal2, startModal1);
moveModalForward(back2Btn, startModal3, startModal2);

startchallenge.addEventListener("click", () => {
    if (selectedChallenge === null) {
        showMessage("Please select a challenge first", "error", "startMessageAlert");
    } else {
        console.log("Starting a challenge", selectedChallenge);
        window.location.href = "challenge.html";
    }
});
async function loadOwnerGroups() {
    const ownerGroups = await getMyGroups();
    if (ownerGroups.length === 0) {
        ownerGroupsContainer.innerHTML = "<p>You have no groups created yet.</p>";
        ownerGroupsContainer.style.textAlign = "center";
    } else {
        ownerGroups.forEach((ownerGroup) => {
            const card = document.createElement("div");
            card.classList.add("owner-group-card");
            card.textContent = ownerGroup.name;
            card.style.fontSize = "14px";
            card.style.fontWeight = "bold";
            card.addEventListener("click", async () => {
                selectedChallenge = null;
                ownerSelectedGroup = null;
                document.querySelectorAll(".owner-group-card").forEach(card => {
                    card.classList.remove("selected-group");
                    const list = card.querySelector(".challenge-list");
                    if (list) {
                        list.remove();
                    }
                });
                card.classList.add("selected-group");
                ownerSelectedGroup = ownerGroup.id;
                ownerSelectedGroupName = ownerGroup.name;
                console.log("selected group: ", ownerSelectedGroup)
                const response = await fetch(`${API_URL}/api/groups/${ownerGroup.id}/challenges`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                const readyChallenges = data.challenges.filter(
                    challenge => challenge.status === "READY"
                );
                const list = document.createElement("div");
                list.classList.add("challenge-list");
                readyChallenges.forEach(challenge => {
                    const item = document.createElement("div");
                    item.classList.add("challenge-card");
                    item.textContent = `${challenge.title} | ${languageName(challenge.language)}`;
                    item.addEventListener("click", (e) => {
                        document.querySelectorAll(".challenge-card").forEach(element => {
                            element.classList.remove("selected");
                        })
                        item.classList.add("selected")
                        e.stopPropagation();
                        selectedChallenge = challenge.id;

                        sessionStorage.setItem("challengeID", selectedChallenge)
                        console.log("seleccted challenge at ownerGroup: ", selectedChallenge)
                    });
                    list.appendChild(item);
                });
                card.appendChild(list);
            });
            ownerGroupsContainer.appendChild(card);
        });
    }

}
async function loadParticipants(challengeid) {
    const AllUsers = await getParticipants(challengeid);
    waitparticipantContainer.innerHTML = "";
    if (AllUsers.length === 0) {
        waitparticipantContainer.innerHTML = "<p>No participants yet</p>";
    } else {
        AllUsers.forEach((user) => {
            const card = document.createElement("div");
            card.classList.add("participant-card");
            card.appendChild(createAvatar(user, "card-avatar"));
            card.appendChild(document.createTextNode(user.username));
            card.style.fontSize = "12px";
            waitparticipantContainer.appendChild(card);
        })
    }
}
async function loadGroups() {
    const groups = await getGroups();
    if (groups.length === 0) {
        groupsContainer.innerHTML = "No groups available yet.";
        groupsContainer.style.textAlign = "center";
    } else {
        groups.forEach((group) => {

            //if (group.ownerId !== user.id) {

                const card = document.createElement("div");
                card.classList.add("group-card");

                card.textContent = group.name;
                card.style.fontSize = "14px";
                card.style.fontWeight = "bold";

                card.addEventListener("click", async () => {

                    selectedChallenge = null;
                    selectedStatus = null;
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
                            challenge.status === "READY" ||
                            challenge.status === "RUNNING" ||
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
                            `${challenge.title} | ${languageName(challenge.language)} (${challenge.status})`;
                        item.addEventListener("click", (e) => {
                            document
                                .querySelectorAll(".challenge-card")
                                .forEach(element => {
                                    element.classList.remove("selected");
                                });
                            item.classList.add("selected");
                            e.stopPropagation();
                            selectedChallenge = challenge.id;
                            selectedStatus = challenge.status;
                            sessionStorage.setItem(
                                "challengeID",
                                selectedChallenge
                            );
                            console.log(
                                "seleccted challenge at Groups: ",
                                sessionStorage.getItem("challengeID")
                            );
                        });
                        list.appendChild(item);
                    });
                    card.appendChild(list);
                });
                groupsContainer.appendChild(card);
            }
       // }
    );
    }

}
function disable(element) {
    element.disabled = true;
}
function enable(element) {
    element.disabled = false;
}
function closeModal(btn, overlay) {
    btn.addEventListener("click", () => {
        overlay.style.display = "none";
    });
}
function moveModalForward(btn, prevModal, actModal) {
    btn.addEventListener("click", () => {
        prevModal.classList.remove("active");
        actModal.classList.add("active");
    })
}