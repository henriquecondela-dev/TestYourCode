import showMessage from "./messagesAlert.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import API_URL from "../config/api_url.js";
const signform = document.getElementById("sign-form");
const signemail = document.getElementById("sign-email");
const username = document.getElementById("username");
const signpassword = document.getElementById("sign-password");
const confirmpassword = document.getElementById("password-confirmation");
const usernameError = document.getElementById("username-error");
const signEmailError = document.getElementById("signemail-error");
const signPasswordError = document.getElementById("signpassword-error");
const signPasswordConfirmError = document.getElementById("confirmpassword-error");

console.log("Signform: ", signform);
signform.addEventListener("submit", async function (event) {
    event.preventDefault();
    let valid = true;
    usernameError.textContent = "";
    signEmailError.textContent = "";
    signPasswordError.textContent = "";
    signPasswordConfirmError.textContent = "";
    if (username.value.trim() === "") {
        usernameError.textContent = "Name is required";
        setTimeout(() => { usernameError.textContent = "" }, 5000);
        valid = false;
    }
    if (signemail.value.trim() === "") {
        signEmailError.textContent = "Email is required";
        setTimeout(() => { signEmailError.textContent = "" }, 5000);
        valid = false;
    } else if (!emailPattern.test(signemail.value)) {
        signEmailError.textContent = "Provide a valid email";
        valid = false;
    }
    if (signpassword.value.trim() === "") {
        signPasswordError.textContent = "Please provide the password";
        setTimeout(() => { signPasswordError.textContent = "" }, 5000);
        valid = false;
    } else if (signpassword.value.length < 6) {
        signPasswordError.textContent = "Mininum 6 characters";
        valid = false;
    } else if (!/[A-Z]/.test(signpassword.value)) {
        signPasswordError.textContent = "Password must contain a upper case";
        valid = false;
    } else if (!/[a-z]/.test(signpassword.value)) {
        signPasswordError.textContent = "Password must contain a lower case";
        valid = false;
    } else if (!/[0-9]/.test(signpassword.value)) {
        signPasswordError.textContent = "Password must contain a number";
        valid = false;
    }
    if (confirmpassword.value !== signpassword.value) {
        signPasswordConfirmError.textContent = "The passwords are different";
        valid = false;
    }
    if (!valid) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: signemail.value,
                password: signpassword.value,
                username: username.value
            })
        });
        const data = await response.json();
        if (!response.ok) {
            //alert(data.message);
            showMessage(`${data.message}`, "error", "signup-error-message")
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (response.status !== 500) {
            showMessage(`${data.message}`, "success", "signup-error-message")
        }
        //alert(`registro realizado com sucesso`);
        setTimeout(() => {
            window.location.href = "../pages/login.html";
        }, 1000)
    } catch (error) {
        console.error("Error during signup:", error);
    }
})