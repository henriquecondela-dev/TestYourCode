//left side consts
const leftSide = document.querySelector(".left-side");
const button = document.getElementById("state-btn");
//creat group consts
const creatgroupBtn = document.getElementById("creatGrup-btn");
const cancelG = document.getElementById("creat-cancel-btn");
const overlayG = document.getElementById("creat-overlay");


//Join a groput consts
const joinButton = document.getElementById("joinGroup-btn");
const overlayJ = document.getElementById("join-overlay");
const groupsContainer = document.getElementById("groups-container");
const cancelJ = document.getElementById("join-cancel-btn");
const joinSelectedButton = document.getElementById("join-selected-btn");
let selectedGroup = null;

//start a challenge consts
const startChallengebutton = document.getElementById("startGroup-btn")
const next1Btn = document.getElementById("next1-btn");
const next2Btn = document.getElementById("next2-btn");
const back1Btn = document.getElementById("back1-btn");
const back2Btn = document.getElementById("back2-btn");
const overlayS = document.getElementById("start-overlay");
const startchallenge = document.getElementById("start-selected-btn");
const cancelS1 = document.getElementById("start-cancel-btn1");
const cancelS2 = document.getElementById("start-cancel-btn2");
const cancelS3 = document.getElementById("start-cancel-btn3");
const ownerGroupsContainer = document.getElementById("owner-groups-container");
const startModal3 = document.getElementById("start-summary-modal");
const startModal2 = document.getElementById("start-settings-modal");
const startModal1 = document.getElementById("start-modal");

const Nparticipants=document.getElementById("NOfPartipants");
const hours= document.getElementById("hours");
const minutes=document.getElementById("minutes");
const seconds=document.getElementById("seconds");
const difficulty=document.getElementById("difficulty");
const language=document.getElementById("language");
const category=document.getElementById("category");

const spinner=document.getElementById("spinner-icon");
const genarateProblemBtn=document.getElementById("generateProblem-btn");

let ownerSelectedGroup = null;
const ownerGroups = [
    {
        id: 8,
        name: "Java Beginners"
    },
    {
        id: 13,
        name: "Python Masters"
    },
    {
        id: 2,
        name: "Python Masters"
    },
    {
        id: 3,
        name: "C++ Warriors"
    },
    {
        id: 4,
        name: "Java Beginners"
    },
    {
        id: 5,
        name: "Python Masters"
    },
    {
        id: 2,
        name: "Python Masters"
    },
    {
        id: 3,
        name: "C++ Warriors"
    },
    {
        id: 4,
        name: "Java Beginners"
    },
    {
        id: 5,
        name: "Python Masters"
    }
];

const groups = [
    {
        id: 1,
        name: "Java Beginners"
    },
    {
        id: 2,
        name: "Python Masters"
    },
    {
        id: 3,
        name: "C++ Warriors"
    },
    {
        id: 4,
        name: "Java Beginners"
    },
    {
        id: 5,
        name: "Python Masters"
    },
    {
        id: 2,
        name: "Python Masters"
    },
    {
        id: 3,
        name: "C++ Warriors"
    },
    {
        id: 4,
        name: "Java Beginners"
    },
    {
        id: 5,
        name: "Python Masters"
    },
    {
        id: 2,
        name: "Python Masters"
    },
    {
        id: 3,
        name: "C++ Warriors"
    },
    {
        id: 4,
        name: "Java Beginners"
    },
    {
        id: 5,
        name: "Python Masters"
    }

];
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
    document.getElementById("textProblem").style.display="block";
    document.getElementById("textProblem").textContent="Generate Problem";

    ownerGroupsContainer.classList.remove("disable");
});
genarateProblemBtn.addEventListener("click", ()=>{
    document.getElementById("textProblem").style.display="none";
    genarateProblemBtn.classList.add("spinning")
    spinner.style.display="block";
    setTimeout(()=>{
        genarateProblemBtn.classList.add("genarated");
        disable(genarateProblemBtn);
        disable(document.getElementById("difficulty"));
        disable(document.getElementById("language"));
        disable(document.getElementById("category"));
        disable(document.getElementById("NOfPartipants"));
        document.getElementById("textProblem").style.display="block";
        document.getElementById("textProblem").textContent="Problem Generated";
        spinner.style.display="none";
        ownerGroupsContainer.classList.add("disable");
    },5000)
});


closeModal(cancelG, overlayG);
closeModal(cancelJ, overlayJ);
closeModal(cancelS1, overlayS);
closeModal(cancelS2, overlayS);
closeModal(cancelS3, overlayS);

moveModalForward(next1Btn, startModal1, startModal2);
moveModalForward(next2Btn, startModal2, startModal3);
moveModalForward(back1Btn, startModal2, startModal1);
moveModalForward(back2Btn, startModal3, startModal2);

startchallenge.addEventListener("click", () => {
    if (ownerSelectedGroup === null) {
        showMessage("Plese select a group first", "error", "startMessageAlert");
    } else {
        console.log("Starting a challenge", ownerSelectedGroup);
        window.location.href="challenge.html";
    }
});
joinSelectedButton.addEventListener("click", function () {
    if (selectedGroup === null) {
        //alert("please select a gropup");
        showMessage("Plese select a group first", "error", "joinMessage");
    } else {
        console.log("joining group", selectedGroup);
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
            card.addEventListener("click", function () {
                document.querySelectorAll(".owner-group-card").forEach((element) => {
                    element.classList.remove("owner-selected-group");

                    //console.log(element);
                });
                card.classList.add("owner-selected-group");
                //console.log(selectedGroup);
                ownerSelectedGroup = ownerGroup.id;
            });
            ownerGroupsContainer.appendChild(card);
        });
    }
}

function loadGroups() {
    if (groups.length === 0) {
        groupsContainer.innerHTML = "<p>No groups availible yet.</p>";
        groupsContainer.style.textAlign = "center";
    } else {
        groups.forEach((group) => {
            const card = document.createElement("div");
            card.classList.add("group-card");
            card.textContent = group.name;
            card.style.fontSize = "14px";
            card.style.fontWeight = "bold";
            card.addEventListener("click", function () {
                document.querySelectorAll(".group-card").forEach((element) => {
                    element.classList.remove("selected-group");
                    //console.log(element);
                });
                card.classList.add("selected-group");
                //console.log(selectedGroup);
                selectedGroup = group.id;
            });
            groupsContainer.appendChild(card);
        });
    }
};
function disable(element){
    element.disabled=true;
}
function enable(element){
    element.disabled=false;
}
