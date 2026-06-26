const divider = document.querySelector(".divider");
const left = document.querySelector(".challenge-info");

let touching = false;

divider.addEventListener("mousedown", () => {
    touching = true;
});

document.addEventListener("mouseup", () => {
    touching = false;
});

document.addEventListener("mousemove", (event) => {
    if (!touching) 
        return;

    left.style.width = event.clientX + "px";
});