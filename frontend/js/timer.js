
const timer = document.getElementById("timer");
const timesrInfo=document.getElementById("challenge-timer");
const pause=document.getElementById("pause-btn");
const play=document.getElementById("play-btn");

let hours = 0;
let minutes = 1;
let seconds = 10;
let running=false;
let intervalcheck=null;

play.addEventListener("click", ()=>{
    if(running) return;
    running=true;
    intervalcheck = setInterval(() => {
        if (hours === 0 && minutes === 0 && seconds === 0
        ) {
            clearInterval(intervalcheck);
            console.log("Tempo esgotado!");
            timesrInfo.style.fontWeight="800";
            timesrInfo.style.fontSize="1.8rem";
            timesrInfo.style.fontFamily="monospace";
            timesrInfo.style.color=" hsl(0, 100%, 57%)";
            timesrInfo.textContent="Tempo esgotado";
            timer.textContent="00:00:00";
            running=false;
            return;
        }
        if(hours===0 && minutes===0 && seconds < 30){
            timer.style.color="hsl(0, 100%, 57%)";
        }
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;

        } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
        }
        timer.textContent =
                `${String(hours).padStart(2, "0")}:` +
                `${String(minutes).padStart(2, "0")}:` +
                `${String(seconds).padStart(2, "0")}`;
    }, 1000);
});
pause.addEventListener("click", ()=>{
    clearInterval(intervalcheck);
    running=false;
});
