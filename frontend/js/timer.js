
const timer = document.getElementById("timer");
const timesrInfo=document.getElementById("challenge-timer");
const pause=document.getElementById("pause-btn");
const play=document.getElementById("play-btn");

let hours = 0;
let minutes = 1;
let seconds = 35;

let running=false;
let intervalcheck=null;
timer.textContent =
                `${String(hours).padStart(2, "0")}:` +
                `${String(minutes).padStart(2, "0")}:` +
                `${String(seconds).padStart(2, "0")}`;
play.addEventListener("click", ()=>{
    if(running) return;
    running=true;
    intervalcheck = setInterval(() => {
        if (hours === 0 && minutes === 0 && seconds === 0
        ) {
            clearInterval(intervalcheck);
            timesrInfo.style.fontWeight="800";
            timesrInfo.style.fontSize="1.8rem";
            timesrInfo.style.fontFamily="monospace";
            timesrInfo.style.color=" hsl(0, 100%, 57%)";
            timesrInfo.textContent="Time Expired";
            timer.textContent="00:00:00";
            currentUser.submitted=true;
            submitButton.disabled=true;
            textarea.disabled=true;
            fileInput.disabled=true;
            running=false;
            return;
        }
        if(hours===0 && minutes <= 1 && seconds < 60){
            timer.classList.add("timer-ending");
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
    timer.classList.remove("timer-ending");
    running=false;
});
