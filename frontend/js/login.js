import API_URL from "../config/api_url.js";
import showMessage from "./messagesAlert.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const loginbtn=document.getElementById("login");
const loginform = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passworderror = document.getElementById("password-error");
const emailerror = document.getElementById("email-error");  

console.log("loginform: ",loginform);
loginform.addEventListener("submit", async function (event) {
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
    }else if (password.value.trim() === "") {
        passworderror.textContent = "Please provide the password";
        valid = false;
        setTimeout(() => { passworderror.textContent = "" }, 5000);
    }if (!valid) {
        return;
    }
    //console.log("Form valid");
    try{
        const response = await fetch(`${API_URL}/api/auth/login`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email:email.value,
                password:password.value
            })
        });
        const data = await response.json();
        if (!response.ok) {
            //alert(data.message);
            showMessage(`${data.message}`, "error", "login-error-message")
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        //alert("Login realizado com sucesso");
        
        showMessage(`${data.message}`, "success", "login-error-message")
        setTimeout(()=>{
            window.location.href ="../pages/index.html";
        },1000)
        
    }catch (error){
        console.error("Error during login:", error);
        //alert("An error occurred during login. Please try again later.");
        }
    });