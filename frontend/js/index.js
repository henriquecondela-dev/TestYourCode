import { getParticipants } from "../data/getParticipants.js";
import { getGroups } from "../data/groups.js";
import { getMyGroups } from "../data/mygroups.js";
import { getToken, saveChallenge } from "../data/store.js";
import { getUsers } from "../data/users.js";
import API_URL from "../config/api_url.js"
sessionStorage.removeItem("challenge");
sessionStorage.removeItem("challengeID");
const token = getToken();
if (!token) {
    window.location.href = "../pages/login.html"
}
import showMessage from "./messagesAlert.js";
import { hoursToSeconds } from "./timeConverter.js";
//left side consts
const leftSide = document.querySelector(".left-side");
const button = document.getElementById("state-btn");
//creat group consts
const creatgroupBtn = document.getElementById("creatGrup-btn");
const createGroup = document.getElementById("creatgroup-btn");
const cancelG = document.getElementById("creat-cancel-btn");
const overlayG = document.getElementById("creat-overlay");
const groupName = document.getElementById("creatGroup-name")

//Join a groput consts
const joinButton = document.getElementById("joinGroup-btn");
const overlayJ = document.getElementById("join-overlay");
const groupsContainer = document.getElementById("groups-container");
const cancelJ = document.getElementById("join-cancel-btn");
const joinSelectedButton = document.getElementById("join-selected-btn");
let selectedGroup = null;
let selectedChallenge = null;
let ownerSelectedChallenge = null;
let ownerSelectedGroup = null;
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


const ownerGroups = await getMyGroups();
const groups = await getGroups();

export const user = JSON.parse(localStorage.getItem("user"));
username.textContent = user.username;
setTimeout(function () {
    showMessage(`Seja Bem vindo de volta ${user.username}`, "success", "message-box")
}, 2000)
button.addEventListener("click", function () {
    leftSide.classList.toggle("collapsed");
    //console.log(leftSide.className);
});
creatgroupBtn.addEventListener("click", function () {
    overlayG.style.display = "flex";
});
joinButton.addEventListener("click", function () {
    overlayJ.style.display = "flex";
});
startChallengebutton.addEventListener("click", function () {
    overlayS.style.display = "flex";
    startModal1.classList.add("active");
    startModal2.classList.remove("active");
    startModal3.classList.remove("active");
    genarateProblemBtn.classList.remove("genarated");
    enable(genarateProblemBtn);
    enable(document.getElementById("difficulty"));
    enable(document.getElementById("language"));
    enable(document.getElementById("category"));
    enable(document.getElementById("NOfPartipants"));
    document.getElementById("textProblem").style.display = "block";
    document.getElementById("textProblem").textContent = "Generate Problem";

    ownerGroupsContainer.classList.remove("disable");
});
genarateProblemBtn.addEventListener("click", async () => {
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
            throw new Error(`Status:${response.status} ,${challenge.message}`)
        }
        showMessage(`${challenge.message}`, "success", "startMessageAlert")
        document.getElementById("summary").innerHTML = `
        <p>Group name:....</p>
        <p>Title:${challenge.challenge.title}</p>
        <p>click START to start the challenge</p>`
        //localStorage.setItem("challenge",JSON.stringify(challenge.challenge));
        sessionStorage.setItem("challengeID", challenge.challenge.id);
        saveChallenge(challenge.challenge);
        //console.log(challenge.challenge);
    } catch (error) {
        console.error("ERRO: was not possible to get the groups", error.message)
    }
    genarateProblemBtn.classList.add("genarated");
    disable(genarateProblemBtn);
    disable(document.getElementById("difficulty"));
    disable(document.getElementById("language"));
    disable(document.getElementById("category"));
    disable(document.getElementById("NOfPartipants"));
    document.getElementById("textProblem").style.display = "block";
    document.getElementById("textProblem").textContent = "Problem Generated";
    spinner.style.display = "none";
    ownerGroupsContainer.classList.add("disable");

});
goInChallengeBtn.addEventListener("click", async function () {
    waitparticipantContainer.textContent = ""
    if (selectedGroup === null) {
        showMessage("Plese select a group first", "error", "joinMessage");
        return;
    } else {
        try {
            const response = await fetch(`${API_URL}/api/groups/${selectedGroup}/join`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json();
            if (!response.ok) {
                if (response.status !== 409 && response.status !== 500) {
                    showMessage(`You are not a member of the group, please join in the group first`, "error", "joinMessage");
                    return;
                }
            }
        } catch (error) {
            console.log(error.message)
            return;
        }
    }
    sessionStorage.setItem("challengeID", selectedGroup)
    await loadUsers(Number(sessionStorage.getItem("challengeID")));
    console.log("seleccted challenge at Groups: ", selectedChallenge)
    overlaygetout.style.display = "block";
    let waithours = 0;
    let waitminutes = 0;
    let waitseconds = 0;
    const interval = setInterval(() => {
        waitseconds++;
        if (waitseconds === 59) {
            waitminutes++;
            waitseconds = 0;
        }
        if (waitminutes === 59) {
            waithours++;
            waitminutes = 0;
        }
        waitTimer.textContent =
            `${String(waithours).padStart(2, "0")}:` +
            `${String(waitminutes).padStart(2, "0")}:` +
            `${String(waitseconds).padStart(2, "0")}`;
        cancelgetOut.addEventListener("click", () => {
            clearInterval(interval);
            overlaygetout.style.display = "none"
            waitTimer.textContent = "00:00:00"
        })
    }, 1000)
})
createGroup.addEventListener("click", async () => {
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
        if (response.status !== 500) {
            showMessage(`${group.message}`, "success", "message-box-create")
        }
    } catch (error) {
        console.error("ERRO: was not possible to create the group", error.message)
    }
})
closeModal(cancelG, overlayG);
closeModal(cancelJ1, overlayJ);
closeModal(cancelS1, overlayS);
closeModal(cancelS2, overlayS);
closeModal(cancelS3, overlayS);
//closeModal(cancelgetOut, overlaygetout)
moveModalForward(next1Btn, startModal1, startModal2);
moveModalForward(next2Btn, startModal2, startModal3);
moveModalForward(back1Btn, startModal2, startModal1);
moveModalForward(back2Btn, startModal3, startModal2);

startchallenge.addEventListener("click", () => {
    if(selectedChallenge===null) {
        showMessage("Plese select a challengefirst", "error", "startMessageAlert");
    }else{
        console.log("Starting a challenge", selectedChallenge);
        window.location.href = "challenge.html";
    }
});
joinSelectedButton.addEventListener("click", async function () {
    if (selectedGroup === null) {
        //alert("please select a gropup");
        showMessage("Plese select a group first", "error", "joinMessage");
        return;
    } else {
        //console.log("joining group", selectedGroup);
        try {
            const response = await fetch(`${API_URL}/api/groups/${selectedGroup}/join`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json();
            if (!response.ok) {
                showMessage(`${data.message}`, "error", "joinMessage");
                return;
            }
            showMessage(`${data.message}`, "success", "joinMessage");
        } catch (error) {
            console.log(error.message)
        }
            sessionStorage.setItem("challengeID", selectedChallenge)
        console.log("seleccted challenge at ownerGroup: ", selectedChallenge)
    }
});
loadGroups();
loadOwnerGroups();

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
function loadOwnerGroups() {
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
                document.querySelectorAll(".owner-group-card").forEach(card => {
                    card.classList.remove("selected-group");
                    const list = card.querySelector(".challenge-list");
                    if (list) {
                        list.remove();
                    }
                });
                card.classList.add("selected-group");
                ownerSelectedGroup = ownerGroup.id;
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
                    item.textContent = `${challenge.title} | ${challenge.language}`;
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
async function loadUsers(challengeid) {
    const AllUsers = await getParticipants(challengeid);
    if (AllUsers.length === 0) {
        waitparticipantContainer.innerHTML = "<p>No participants yet</p>";
    } else {
        AllUsers.forEach((user) => {
            const card = document.createElement("div");
            card.classList.add("participant-card");
            card.textContent = user.username;
            card.style.fontSize = "12px";
            waitparticipantContainer.appendChild(card);
        })
    }
}
function loadGroups() {
    if (groups.length === 0) {
        groupsContainer.innerHTML = "<p>No groups availible yet.</p>";
        groupsContainer.style.textAlign = "center";
    } else {
        groups.forEach((group) => {
            if (group.ownerId !== user.id) {
                //console.log(group.ownerId)
                const card = document.createElement("div");
                card.classList.add("group-card");
                card.textContent = group.name;
                card.style.fontSize = "14px";
                card.style.fontWeight = "bold";
                card.addEventListener("click", async () => {
                    document.querySelectorAll(".group-card").forEach(card => {
                        card.classList.remove("selected-group");
                        const list = card.querySelector(".challenge-list");
                        if (list) {
                            list.remove();
                        }
                    });
                    card.classList.add("selected-group");
                    selectedGroup = group.id;
                    const response = await fetch(`${API_URL}/api/groups/${group.id}/challenges`, {
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
                        item.textContent = `${challenge.title} | ${challenge.language}`;
                        item.addEventListener("click", (e) => {
                            document.querySelectorAll(".challenge-card").forEach(element => {
                                element.classList.remove("selected");
                            })
                            item.classList.add("selected")
                            e.stopPropagation();
                            selectedChallenge = challenge.id;
                            sessionStorage.setItem("challengeID", selectedChallenge)
                            console.log("seleccted challenge at Groups: ", sessionStorage.getItem("challengeID"))
                        });
                        list.appendChild(item);
                    });
                    card.appendChild(list);
                });
                groupsContainer.appendChild(card);

            }
        });
    }
};

function disable(element) {
    element.disabled = true;
}

function enable(element) {
    element.disabled = false;
}
