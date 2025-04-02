import {darkButton} from "./helpers.js";


document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector(".register-form");

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = {
            username: document.querySelector("input[name='username']").value,
            email: document.querySelector("input[name='email']").value,
            password: document.querySelector("input[name='password']").value,
            confirmPassword: document.querySelector("input[name='confirm-password']").value
        };

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Registration successful!");
                window.location.href = "/";
            } else {
                alert(result.message || "Registration failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });


    const darkModeButton = document.getElementById("dark-mode");
    const body = document.body;

    darkButton(body,darkModeButton);


});
