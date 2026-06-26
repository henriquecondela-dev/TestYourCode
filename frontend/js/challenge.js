const upload = document.getElementById("file");
const fileName = document.getElementById("file-name");
const participantContainer=document.getElementById("participants-container");
const users=[
    {
        id:1,
        username:"Henrique",
        submitted:false
    },
    {
        id:2,
        username:"Simiao",
        submitted:true
    },
    {
        id:3,
        username:"Antonio",
        submitted:true
    }
];
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

const textarea = document.getElementById("code");
const lineNumbers = document.getElementById("line-numbers");
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
            "       ",
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

