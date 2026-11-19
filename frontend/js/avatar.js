export const avatarsTotal = 14;
export const avatarColors = {
    black: "hsl(0, 0%, 7%)",
    green: "hsl(137, 56%, 27%)",
    blue: "hsl(212, 60%, 35%)",
    red: "hsl(0, 60%, 40%)",
    orange: "hsl(28, 80%, 40%)",
    purple: "hsl(270, 40%, 40%)"
}
export function createAvatar(user, className) {
    const box = document.createElement("span");
    box.classList.add(className);
    fillAvatar(box, user);
    return box;
}
export function fillAvatar(box, user) {
    box.textContent = "";
    box.style.backgroundColor = "";
    box.style.color = "";
    if (user.avatar) {
        const img = document.createElement("img");
        img.src = `/assets/images/avatars/${user.avatar}`;
        img.alt = "";
        box.appendChild(img);
        return;
    }
    box.textContent = user.username[0].toUpperCase();
    if (user.avatarColor && avatarColors[user.avatarColor]) {
        box.style.backgroundColor = avatarColors[user.avatarColor];
        box.style.color = "hsl(0, 0%, 96%)";
    }
}
