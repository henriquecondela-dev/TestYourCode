export default function showMessage(message, type, local) {
    const box = document.getElementById(`${local}`);
    box.textContent = message;
    box.className = type;
    box.style.display = "block";
    setTimeout(() => {
        box.style.display = "none";
    },6000);
}




