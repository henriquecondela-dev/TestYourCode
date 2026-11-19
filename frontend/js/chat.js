import { getToken } from "../data/store.js";
import { syncChat } from "../data/syncChat.js";
import { sendMessage } from "../data/sendMessage.js";
import showMessage from "./messagesAlert.js";
import { createAvatar, fillAvatar } from "./avatar.js";

const token = getToken();
if (!token) {
    window.location.href = "../pages/login.html"
}
const user = JSON.parse(sessionStorage.getItem("user"));
const leftSide = document.querySelector(".left-side");
const button = document.getElementById("state-btn");
const username = document.getElementById("userName");
const messagesBox = document.getElementById("messages");
const textarea = document.getElementById("msg");
const sendButton = document.getElementById("send-btn");
const mentionList = document.getElementById("mention-list");
const mentionItems = document.getElementById("mention-items");
const onlineList = document.getElementById("online-list");
const offlineList = document.getElementById("offline-list");
const onlineCount = document.getElementById("online-count");
const offlineCount = document.getElementById("offline-count");
const onlineButton = document.getElementById("online-btn");
const onlineSide = document.querySelector(".online-side");
const closeOnline = document.getElementById("close-online");

let lastId = 0;
let users = [];
let sending = false;
let offline = false;
const errors = {
    "Empty Message": "Write something before sending.",
    "Message Too Long": "Your message is too long. Max 500 characters.",
    "Too Fast": "Wait a second before sending again.",
    "No Response": "The server is not responding. Try again."
}

username.textContent = user.username;
fillAvatar(document.getElementById("mini-avatar"), user);

button.addEventListener("click", function () {
    leftSide.classList.toggle("collapsed");
});
onlineButton.addEventListener("click", function () {
    onlineSide.classList.toggle("show");
});
closeOnline.addEventListener("click", function () {
    onlineSide.classList.remove("show");
});

async function loadChat() {
    if (document.hidden) {
        return;
    }
    const chat = await syncChat(lastId);
    if (!chat) {
        showConnection(false);
        return;
    }
    showConnection(true);
    users = chat.users;
    renderUsers(users);
    renderMessages(chat.messages);
}

function showConnection(connected) {
    const box = document.getElementById("chat-message");
    if (!connected && !offline) {
        offline = true;
        box.textContent = "Connection lost. Trying again...";
        box.className = "error";
        box.style.display = "block";
    } else if (connected && offline) {
        offline = false;
        showMessage("Connected again.", "success", "chat-message");
    }
}

function renderMessages(messages) {
    if (messages.length === 0) {
        return;
    }
    const nearBottom = messagesBox.scrollHeight - messagesBox.scrollTop - messagesBox.clientHeight < 80;
    const empty = document.getElementById("empty-chat");
    if (empty) {
        empty.remove();
    }
    messages.forEach((message) => {
        if (message.id <= lastId) {
            return;
        }
        messagesBox.appendChild(createMessage(message));
        lastId = message.id;
    });
    if (nearBottom || lastId === messages[messages.length - 1].id) {
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }
}

function createMessage(message) {
    const mine = message.user.username === user.username;
    const card = document.createElement("div");
    card.classList.add("message");
    if (mine) {
        card.classList.add("mine");
    }
    if (!mine && message.content.includes(`@${user.username}`)) {
        card.classList.add("mention-me");
    }
    const avatar = createAvatar(message.user, "avatar");

    const body = document.createElement("div");
    body.classList.add("msg-body");

    const head = document.createElement("p");
    head.classList.add("msg-head");
    const name = document.createElement("b");
    name.textContent = message.user.username;
    head.appendChild(name);
    if (mine) {
        const you = document.createElement("span");
        you.classList.add("you");
        you.textContent = "you";
        head.appendChild(you);
    }
    const time = document.createElement("span");
    time.classList.add("msg-time");
    time.textContent = formatTime(message.createdAt);
    head.appendChild(time);

    const text = document.createElement("p");
    writeText(text, message.content);

    body.appendChild(head);
    body.appendChild(text);
    card.appendChild(avatar);
    card.appendChild(body);
    return card;
}

function writeText(element, content) {
    const parts = content.split(/(@[\w.]+)/g);
    parts.forEach((part) => {
        if (part.startsWith("@") && users.some(u => `@${u.username}` === part)) {
            const mention = document.createElement("span");
            mention.classList.add("mention");
            mention.textContent = part;
            element.appendChild(mention);
        } else {
            element.appendChild(document.createTextNode(part));
        }
    });
}

function formatTime(date) {
    const time = new Date(date);
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

function renderUsers(list) {
    onlineList.innerHTML = "";
    offlineList.innerHTML = "";
    const online = list.filter(u => u.status !== "offline");
    const offline = list.filter(u => u.status === "offline");
    onlineCount.textContent = online.length;
    offlineCount.textContent = offline.length;
    onlineButton.lastChild.textContent = `${online.length} online`;
    online.forEach((u) => {
        onlineList.appendChild(createUser(u));
    });
    offline.forEach((u) => {
        offlineList.appendChild(createUser(u));
    });
}

function createUser(u) {
    const item = document.createElement("li");
    const dot = document.createElement("span");
    dot.classList.add("on-dot");
    if (u.status === "playing") {
        dot.classList.add("playing");
    }
    if (u.status === "offline") {
        dot.classList.add("off");
    }
    item.appendChild(dot);
    item.appendChild(createAvatar(u, "list-avatar"));
    item.appendChild(document.createTextNode(u.username));
    if (u.status !== "offline") {
        const small = document.createElement("small");
        if (u.username === user.username) {
            small.textContent = "you";
        } else if (u.status === "playing") {
            small.textContent = "in a challenge";
        } else {
            small.textContent = "online";
        }
        item.appendChild(small);
    }
    return item;
}

async function send() {
    const content = textarea.value.trim();
    if (sending) {
        return;
    }
    if (content === "") {
        showMessage(errors["Empty Message"], "error", "chat-message");
        return;
    }
    if (content.length > 500) {
        textarea.classList.add("too-long");
        showMessage(errors["Message Too Long"], "error", "chat-message");
        return;
    }
    sending = true;
    sendButton.disabled = true;
    const result = await sendMessage(content);
    if (result.error) {
        showMessage(errors[result.error] || result.error, "error", "chat-message");
    } else {
        textarea.value = "";
        textarea.classList.remove("too-long");
        await loadChat();
    }
    sending = false;
    sendButton.disabled = false;
    textarea.focus();
}

sendButton.addEventListener("click", send);

textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (mentionList.classList.contains("show")) {
            const first = mentionItems.querySelector(".mention-item");
            if (first) {
                chooseMention(first.dataset.username);
                return;
            }
        }
        send();
    }
    if (event.key === "Escape") {
        mentionList.classList.remove("show");
    }
});

textarea.addEventListener("input", () => {
    const beforeCursor = textarea.value.slice(0, textarea.selectionStart);
    const found = beforeCursor.match(/@([\w.]*)$/);
    if (!found) {
        mentionList.classList.remove("show");
        return;
    }
    const typed = found[1].toLowerCase();
    const matches = users.filter(u =>
        u.username !== user.username &&
        u.username.toLowerCase().startsWith(typed)
    ).slice(0, 5);
    renderMentions(matches);
});

function renderMentions(matches) {
    mentionItems.innerHTML = "";
    if (matches.length === 0) {
        mentionList.classList.remove("show");
        return;
    }
    matches.forEach((u, index) => {
        const item = document.createElement("button");
        item.type = "button";
        item.classList.add("mention-item");
        if (index === 0) {
            item.classList.add("selected");
        }
        item.dataset.username = u.username;
        const dot = document.createElement("span");
        dot.classList.add("on-dot");
        if (u.status === "playing") {
            dot.classList.add("playing");
        }
        if (u.status === "offline") {
            dot.classList.add("off");
        }
        const small = document.createElement("small");
        small.textContent = u.status === "playing" ? "in a challenge" : u.status;
        item.appendChild(dot);
        item.appendChild(createAvatar(u, "list-avatar"));
        item.appendChild(document.createTextNode(u.username));
        item.appendChild(small);
        item.addEventListener("click", function () {
            chooseMention(u.username);
        });
        mentionItems.appendChild(item);
    });
    mentionList.classList.add("show");
}

function chooseMention(name) {
    const cursor = textarea.selectionStart;
    const beforeCursor = textarea.value.slice(0, cursor).replace(/@([\w.]*)$/, `@${name} `);
    const afterCursor = textarea.value.slice(cursor);
    textarea.value = beforeCursor + afterCursor;
    textarea.selectionStart = beforeCursor.length;
    textarea.selectionEnd = beforeCursor.length;
    mentionList.classList.remove("show");
    textarea.focus();
}

await loadChat();
setInterval(loadChat, 3000);
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        loadChat();
    }
});
