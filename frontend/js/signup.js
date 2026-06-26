const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signform = document.getElementById("sign-form");
const signemail = document.getElementById("sign-email");
const username = document.getElementById("username");
const signpassword = document.getElementById("sign-password");
const confirmpassword = document.getElementById("password-confirmation");
const usernameError = document.getElementById("username-error");
const signEmailError = document.getElementById("signemail-error");
const signPasswordError = document.getElementById("signpassword-error");
const signPasswordConfirmError = document.getElementById("confirmpassword-error");

console.log("Signform: ",signform);
signform.addEventListener("submit", function (event) {
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
        
    } else if (signpassword.value.length < 4) {
        signPasswordError.textContent = "Mininum 4 characters";
        valid = false;
    } else if (!/[A-Z]/.test(signpassword.value)) {
        signPasswordError.textContent = "Passwor must contain a upper case";
        valid = false;
    } else if (!/[a-z]/.test(signpassword.value)) {
        signPasswordError.textContent = "Passwor must contain a lower case";
        valid = false;
    } else if (!/[0-9]/.test(signpassword.value)) {
        signPasswordError.textContent = "Passwor must contain a number";
        valid = false;
    }
    if (confirmpassword.value !== signpassword.value) {
        signPasswordConfirmError.textContent = "The password are diferent"
        valid = false;
    }
    if (!valid) {
        return;
    }

    console.log("Form valid");
});