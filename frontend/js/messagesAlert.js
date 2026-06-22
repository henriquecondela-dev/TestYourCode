

function showMessage(message, type, local){
    const box = document.getElementById(`${local}`);
    box.textContent=message;
    box.className=type;
    box.style.display="block";
    setTimeout(()=>{
        box.style.display="none";
    }, 5000);

}
const email=document.getElementById("email");
const error=document.getElementById("group-error");
error.textContent="";
if(email.value.trim()===""){
    error.textContent="Please enter a valid email";
    setTimeout(()=>{error.textContent=""},3000);
}
