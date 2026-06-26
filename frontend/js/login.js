const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const loginbtn=document.getElementById("login");
const loginform = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passworderror = document.getElementById("password-error");
const emailerror = document.getElementById("email-error");

console.log("loginform: ",loginform);
loginform.addEventListener("submit", function (event) {
    event.preventDefault();
    let valid = true;
    emailerror.textContent = "";
    passworderror.textContent = "";
    if (email.value.trim() === "") {
        emailerror.textContent = "Email is required";
        setTimeout(() => { emailerror.textContent = "" }, 5000);
        valid = false;
    } else if (!emailPattern.test(email.value)) {
        emailerror.textContent = "Provide a valid email";
        valid = false;
    }
    if (password.value.trim() === "") {
        passworderror.textContent = "Please provide the password";
        valid = false;
        setTimeout(() => { passworderror.textContent = "" }, 5000);
    } else if (password.value.length < 4) {
        passworderror.textContent = "Mininum 4 characters";
        valid = false;
    } else if (!/[A-Z]/.test(password.value)) {
        passworderror.textContent = "Password must contain a upper case";
        valid = false;
    } else if (!/[a-z]/.test(password.value)) {
        passworderror.textContent = "Password must contain a lower case";
        valid = false;
    } else if (!/[0-9]/.test(password.value)) {
        passworderror.textContent = "Password must contain a number";
        valid = false;
    }
    if (!valid) {
        return;
    }

    console.log("Form valid");
});