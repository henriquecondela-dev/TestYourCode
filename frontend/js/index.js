//left side consts
const leftSide=document.querySelector(".left-side");
const button=document.getElementById("state-btn");
//creat group consts
const creatgroupBtn=document.getElementById("creatGrup-btn");
const cancelG=document.getElementById("creat-cancel-btn");
const overlayG=document.getElementById("creat-overlay");
const modalG=document.getElementById("creat-modal");

//Join a groput consts
const joinButton =document.getElementById("joinGroup-btn");
const overlayJ =document.getElementById("join-overlay");
const groupsContainer =document.getElementById("groups-container");
const cancelJ =document.getElementById("join-cancel-btn");
const joinSelectedButton=document.getElementById("join-selected-btn");
let selectedGroup = null;
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
    },
   
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

function loadGroups(){
    if(groups.length===0){
        groupsContainer.innerHTML="<p>No groups availible yet.</p>";
        groupsContainer.style.textAlign="center";
    }else{
        groups.forEach((group)=>{
            const card=document.createElement("div");
            card.classList.add("group-card");
            card.textContent=group.name;
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
}
joinSelectedButton.addEventListener("click", function(){
    if (selectedGroup===null){
        alert("please select a gropup");
    }else{
        console.log("joining group", selectedGroup);
    }
});
loadGroups();