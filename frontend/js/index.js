const leftSide=document.querySelector(".left-side");
const button=document.getElementById("state-btn");

button.addEventListener("click", function(){
  
    leftSide.classList.toggle("collapsed");
    //console.log(leftSide.className);
});