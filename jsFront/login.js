import {darkButton} from './helpers.js';

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");
    const errorMessage = document.querySelector(".wrong-password");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = {
            email: document.querySelector("input[name='email']").value,
            password: document.querySelector("input[name='password']").value
        }

        if (!formData.email || !formData.password) {
            errorMessage.style.display = "block";
            errorMessage.innerHTML = "Please enter a both  email and password";
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            console.log("Response Status:", response.status);
            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('access_token', result.token);
                window.location.href = "/home";
            } else {
                errorMessage.style.display='block'
                errorMessage.innerHTML = result.message || "Login failed!";
                // alert(result.message || "Login failed!");
            }
        } catch (error) {
            errorMessage.style.display='block'
            errorMessage.innerHTML = "An error occurred. Please try again.";
        }
    });

    const darkModeButton = document.getElementById("dark-mode");
    const body = document.body;

    darkButton(body, darkModeButton);



});


