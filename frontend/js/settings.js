import { getToken } from "../data/store.js";
import { getMe } from "../data/getMe.js";
import { getMyGroups } from "../data/mygroups.js";
import { saveAvatar } from "../data/saveAvatar.js";
import { changePassword } from "../data/changePassword.js";
import { deleteGroup } from "../data/deleteGroup.js";
import { deleteAccount } from "../data/deleteAccount.js";
import { avatarsTotal, avatarColors, fillAvatar } from "./avatar.js";
import showMessage from "./messagesAlert.js";

const token = getToken();
if (!token) {
    window.location.href = "../pages/login.html"
}
const user = JSON.parse(sessionStorage.getItem("user"));
const leftSide = document.querySelector(".left-side");
const button = document.getElementById("state-btn");
const username = document.getElementById("userName");
const miniAvatar = document.getElementById("mini-avatar");
const avatarBig = document.getElementById("avatar-big");
const previewName = document.getElementById("preview-name");
const avatarGrid = document.getElementById("avatar-grid");
const colorRow = document.getElementById("color-row");
const saveAvatarBtn = document.getElementById("save-avatar");
const passwordForm = document.getElementById("password-form");
const currentPassword = document.getElementById("current-password");
const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");
const groupList = document.getElementById("group-list");
const deleteAccountRow = document.getElementById("delete-account-row");
const deleteConfirm = document.getElementById("delete-confirm");
const deletePassword = document.getElementById("delete-password");

let selectedAvatar = null;
let selectedColor = null;

username.textContent = user.username;
previewName.textContent = user.username;

button.addEventListener("click", function () {
    leftSide.classList.toggle("collapsed");
});

async function loadProfile() {
    const me = await getMe();
    if (!me) {
        showMessage("Could not load your profile. Try again.", "error", "avatar-message");
        return;
    }
    document.getElementById("account-username").textContent = me.username;
    document.getElementById("account-email").textContent = me.email;
    selectedAvatar = me.avatar || null;
    selectedColor = me.avatarColor || null;
    user.avatar = selectedAvatar;
    user.avatarColor = selectedColor;
    sessionStorage.setItem("user", JSON.stringify(user));
    fillAvatar(miniAvatar, user);
    renderChoices();
}

function renderChoices() {
    const current = { username: user.username, avatar: selectedAvatar, avatarColor: selectedColor };
    fillAvatar(avatarBig, current);
    avatarGrid.innerHTML = "";
    for (let i = 1; i <= avatarsTotal; i++) {
        const file = `avatar${i}.jpg`;
        const option = document.createElement("button");
        option.type = "button";
        option.classList.add("avatar-option");
        if (file === selectedAvatar) {
            option.classList.add("selected");
        }
        const img = document.createElement("img");
        img.src = `/assets/images/avatars/${file}`;
        img.alt = `avatar ${i}`;
        option.appendChild(img);
        option.addEventListener("click", function () {
            selectedAvatar = file;
            selectedColor = null;
            renderChoices();
        });
        avatarGrid.appendChild(option);
    }
    colorRow.innerHTML = "";
    Object.keys(avatarColors).forEach((color) => {
        const option = document.createElement("button");
        option.type = "button";
        option.classList.add("color-option");
        if (!selectedAvatar && color === selectedColor) {
            option.classList.add("selected");
        }
        option.style.backgroundColor = avatarColors[color];
        option.textContent = user.username[0].toUpperCase();
        option.title = color;
        option.addEventListener("click", function () {
            selectedAvatar = null;
            selectedColor = color;
            renderChoices();
        });
        colorRow.appendChild(option);
    });
}

saveAvatarBtn.addEventListener("click", async function () {
    saveAvatarBtn.disabled = true;
    const result = await saveAvatar({
        avatar: selectedAvatar,
        avatarColor: selectedColor
    });
    saveAvatarBtn.disabled = false;
    if (result.error) {
        showMessage(result.error, "error", "avatar-message");
        return;
    }
    user.avatar = selectedAvatar;
    user.avatarColor = selectedColor;
    sessionStorage.setItem("user", JSON.stringify(user));
    fillAvatar(miniAvatar, user);
    showMessage("Avatar saved.", "success", "avatar-message");
});

passwordForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const error = checkPassword();
    if (error) {
        showMessage(error, "error", "password-message");
        return;
    }
    const result = await changePassword({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
    });
    if (result.error) {
        showMessage(result.error, "error", "password-message");
        return;
    }
    passwordForm.reset();
    showMessage("Password changed.", "success", "password-message");
});

function checkPassword() {
    if (currentPassword.value === "") {
        return "Please write your current password";
    } else if (newPassword.value.length < 6) {
        return "Mininum 6 characters";
    } else if (!/[A-Z]/.test(newPassword.value)) {
        return "Password must contain a upper case";
    } else if (!/[a-z]/.test(newPassword.value)) {
        return "Password must contain a lower case";
    } else if (!/[0-9]/.test(newPassword.value)) {
        return "Password must contain a number";
    } else if (newPassword.value !== confirmPassword.value) {
        return "The passwords are different";
    } else if (newPassword.value === currentPassword.value) {
        return "The new password is the same as the current one";
    }
    return null;
}

async function loadGroups() {
    groupList.innerHTML = "";
    const groups = await getMyGroups();
    if (!groups || groups.length === 0) {
        const empty = document.createElement("p");
        empty.classList.add("empty");
        empty.textContent = "You have no groups yet.";
        groupList.appendChild(empty);
        return;
    }
    groups.forEach((group) => {
        groupList.appendChild(createGroupRow(group));
    });
}

function createGroupRow(group) {
    const row = document.createElement("div");
    row.classList.add("group-row");
    const info = document.createElement("div");
    const name = document.createElement("p");
    name.classList.add("group-name");
    name.textContent = group.name;
    const details = document.createElement("p");
    details.classList.add("group-info");
    details.textContent = groupDetails(group);
    info.appendChild(name);
    info.appendChild(details);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("btn-danger");
    deleteBtn.textContent = "Delete";

    const confirmButtons = document.createElement("div");
    confirmButtons.classList.add("confirm-buttons");
    confirmButtons.style.display = "none";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.classList.add("btn-gray");
    cancel.textContent = "Cancel";
    const yes = document.createElement("button");
    yes.type = "button";
    yes.classList.add("btn-danger", "solid");
    yes.textContent = "Yes, delete";
    confirmButtons.appendChild(cancel);
    confirmButtons.appendChild(yes);

    deleteBtn.addEventListener("click", function () {
        row.classList.add("confirm");
        details.textContent = `Delete "${group.name}"? This can not be undone.`;
        deleteBtn.style.display = "none";
        confirmButtons.style.display = "flex";
    });
    cancel.addEventListener("click", function () {
        row.classList.remove("confirm");
        details.textContent = groupDetails(group);
        deleteBtn.style.display = "";
        confirmButtons.style.display = "none";
    });
    yes.addEventListener("click", async function () {
        yes.disabled = true;
        const result = await deleteGroup(group.id);
        yes.disabled = false;
        if (result.error) {
            showMessage(result.error, "error", "groups-message");
            return;
        }
        showMessage(`Group "${group.name}" deleted.`, "success", "groups-message");
        await loadGroups();
    });

    row.appendChild(info);
    row.appendChild(deleteBtn);
    row.appendChild(confirmButtons);
    return row;
}

function groupDetails(group) {
    if (group.members === undefined) {
        return "";
    }
    const members = `${group.members} ${group.members === 1 ? "member" : "members"}`;
    const challenges = `${group.challenges} ${group.challenges === 1 ? "challenge" : "challenges"}`;
    return `${members} · ${challenges}`;
}

document.getElementById("delete-account-btn").addEventListener("click", function () {
    deleteAccountRow.style.display = "none";
    deleteConfirm.classList.add("show");
    deletePassword.focus();
});
document.getElementById("cancel-delete-account").addEventListener("click", function () {
    deleteConfirm.classList.remove("show");
    deleteAccountRow.style.display = "";
    deletePassword.value = "";
});
document.getElementById("confirm-delete-account").addEventListener("click", async function () {
    if (deletePassword.value === "") {
        showMessage("Please write your password", "error", "account-message");
        return;
    }
    const result = await deleteAccount({ password: deletePassword.value });
    if (result.error) {
        showMessage(result.error, "error", "account-message");
        return;
    }
    sessionStorage.clear();
    window.location.href = "../pages/home.html";
});

await loadProfile();
await loadGroups();
