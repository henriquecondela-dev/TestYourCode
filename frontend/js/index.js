//left side consts
const leftSide=document.querySelector(".left-side");
const button=document.getElementById("state-btn");
//creat group consts
const creatgroupBtn=document.getElementById("creatGrup-btn");
const cancelG=document.getElementById("creat-cancel-btn");
const overlayG=document.getElementById("creat-overlay");


//Join a groput consts
const joinButton =document.getElementById("joinGroup-btn");
const overlayJ =document.getElementById("join-overlay");
const groupsContainer =document.getElementById("groups-container");
const cancelJ =document.getElementById("join-cancel-btn");
const joinSelectedButton=document.getElementById("join-selected-btn");
let selectedGroup = null;

//start a challenge consts
const startChallengebutton=document.getElementById("startGroup-btn")
const overlayS=document.getElementById("start-overlay");
const startSelectedButton=document.getElementById("start-selected-btn");
const cancelS=document.getElementById("start-cancel-btn");
const ownerGroupsContainer=document.getElementById("owner-groups-container");
const startModal= document.getElementById("start-modal");

let ownerSelectedGroup=null;
const ownerGroups = [
    {
        id:8,
        name:"Java Beginners"
    },
    {
        id:13,
        name:"Python Masters"
    }
];

const groups = [
    {
        id:1,
        name:"Java Beginners"
    },
    {
        id:2,
        name:"Python Masters"
    },
    {
        id:3,
        name:"C++ Warriors"
    },
    {
        id:4,
        name:"Java Beginners"
    },
    {
        id:5,
        name:"Python Masters"
    }
   
];

button.addEventListener("click", function(){
  
    leftSide.classList.toggle("collapsed");
    //console.log(leftSide.className);
});
creatgroupBtn.addEventListener("click", function(){
    overlayG.style.display="flex";
   
});
cancelG.addEventListener("click", function(){
     overlayG.style.display="none";
});
joinButton.addEventListener("click", function(){
    overlayJ.style.display="flex";
   
});
cancelJ.addEventListener("click", function(){
     overlayJ.style.display="none";
});
startChallengebutton.addEventListener("click",function(){
    overlayS.style.display="flex";
});
cancelS.addEventListener("click", ()=>{
    overlayS.style.display="none";
});

function loadGroups(){
    if(groups.length===0){
        groupsContainer.innerHTML="<p>No groups availible yet.</p>";
        groupsContainer.style.textAlign="center";
    }else{
        groups.forEach((group)=>{
            const card=document.createElement("div");
            card.classList.add("group-card");
            card.textContent=group.name;
            card.style.fontSize="14px";
            card.style.fontWeight="bold";
            card.addEventListener("click", function(){
                document.querySelectorAll(".group-card").forEach((element)=>{
                    element.classList.remove("selected-group");
                    //console.log(element);
                });
                card.classList.add("selected-group");
                //console.log(selectedGroup);
                selectedGroup=group.id;
            });
            groupsContainer.appendChild(card);
        });
    }
};
function loadOwnerGroups(){
    if(ownerGroups.length===0){
        ownerGroupsContainer.innerHTML="<p>You have no groups created yet.</p>";
        ownerGroupsContainer.style.textAlign="center";
    }else{
        ownerGroups.forEach((ownerGroup)=>{
            const card=document.createElement("div");
            card.classList.add("owner-group-card");
            card.textContent=ownerGroup.name;
            card.style.fontSize="14px";
            card.style.fontWeight="bold";
            card.addEventListener("click", function(){
                document.querySelectorAll(".owner-group-card").forEach((element)=>{
                    element.classList.remove("owner-selected-group");

                    //console.log(element);
                });
                card.classList.add("owner-selected-group");
                //console.log(selectedGroup);
                ownerSelectedGroup=ownerGroup.id;
            });
           ownerGroupsContainer.appendChild(card);
        });
    }
}

/*startModal.addEventListener("click",()=>{
    ownerSelectedGroup=null;
});
*/
startSelectedButton.addEventListener("click",()=>{
    if(ownerSelectedGroup===null){
        showMessage("Plese select a group first","success","startMessage");
    }else{
        console.log("Starting a challenge", ownerSelectedGroup);
    }
});
joinSelectedButton.addEventListener("click", function(){
    if (selectedGroup===null){
        //alert("please select a gropup");
        showMessage("Plese select a group first","alert","joinMessage");
    }else{
        console.log("joining group", selectedGroup);
    }
});
loadGroups();
loadOwnerGroups();