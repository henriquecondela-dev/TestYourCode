const leftSide=document.querySelector(".left-side");
const button=document.getElementById("state-btn");
const creatgroupBtn=document.getElementById("creatGrup-btn");
const cancelBtn=document.getElementById("cancel-btn");
const overlyG=document.getElementById("overlay");
const modalG=document.getElementById("modal");

button.addEventListener("click", function(){
  
    leftSide.classList.toggle("collapsed");
    //console.log(leftSide.className);
});
creatgroupBtn.addEventListener("click", function(){
    overlyG.style.display="flex";
    modalG.style.display="block";
});
cancelBtn.addEventListener("click", function(){
     overlyG.style.display="none";
    modalG.style.display="none";
})