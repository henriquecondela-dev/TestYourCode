const upload = document.getElementById("file");
const fileName = document.getElementById("file-name");
const participantContainer=document.getElementById("participants-container");

const textarea = document.getElementById("code");
const lineNumbers = document.getElementById("line-numbers");
const fileInput= document.getElementById("file");

const submitButton=document.getElementById("submitSolution-btn");
const users=[
    {
        id:1,
        username:"Henrique",
        submitted:false,
        solution:null
    },
    {
        id:2,
        username:"Simiao",
        submitted:true,
        solution:{
            type:"text",
            content:"Hello ever one"
        }
    },
    {
        id:3,
        username:"Antonio",
        submitted:true,
        solution:{
            type:"text",
            content:"Hello ever one"
        }
    },{
        id:4,
        username:"pedro",
        submitted:true,
        solution:{
            type:"text",
            content:"Hello ever one"
        }
    },{
        id:5,
        username:"Ana cristia",
        submitted:true,
        solution:{
            type:"text",
            content:"Hello ever one"
        }
    },
    {
        id:3,
        username:"Antonio",
        submitted:true,
        solution:{
            type:"text",
            content:"Hello ever one"
        }
    },
    {
        id:3,
        username:"Antonio",
        submitted:false,
        solution:{
            type:"text",
            content:"Hello ever one"
        }
    },
    {
        id:3,
        username:"Andrea",
        submitted:false,
        solution:{
            type:"text",
            content:"Hello ever one"
        }
    }
];
const currentUserId=1;
const currentUser=users.find((user)=>{ return user.id===currentUserId});
document.getElementById("userName").textContent=currentUser.username;
submitButton.addEventListener("click",()=>{
        console.log("voce clicou")
        if(fileInput.files.length>0){
            currentUser.solution = {
                type:"file",
                content:fileInput.files[0].name
            }
        }else if(textarea.value.trim() !==""){
            currentUser.solution = {
                type:"text",
                content:textarea.value
            }
        }else{
            showMessage("Please, Provide a solution before trying to submit","challengeAlert","challege-message");
            return;
        }
    submitButton.textContent="solution submitted";
    currentUser.submitted=true;
    submitButton.disabled=true;
    textarea.disabled=true;
    fileInput.disabled=true;
    document.getElementById("status").textContent="SOLUTION SUBMITTED";
    document.getElementById("status").style.color="green";
})

const allsubmitted=users.every(function(user){
    user.submitted
});
function loadUsers(){
    if(users.length===0){
        participantContainer.innerHTML="<p>No user yet</p>";
    }else{
        users.forEach((user)=>{
            const card=document.createElement("div");
            card.classList.add("participant-card");
            card.textContent=user.username;
            card.style.fontSize="12px";
            if(user.submitted){
                card.classList.add("submitted");
            }
            participantContainer.appendChild(card);
        });
    }
}
loadUsers();
upload.addEventListener("change", () => {
    fileName.textContent = upload.files[0]?.name || "No file";
});

textarea.addEventListener("input",()=>{
        updateLines();
       const lastChar = textarea.value[textarea.value.length - 1];
        if (lastChar === "{") {
            textarea.value += "}";
        }else if(lastChar=== "("){
            textarea.value +=")";
        }else if(lastChar=== "["){
            textarea.value +="]";
        }else if(lastChar=== `"`){
            textarea.value +=`"`;
        }else if(lastChar=== "`"){
            textarea.value +="`";
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
    "scroll",()=>{
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

