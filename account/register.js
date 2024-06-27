"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const registrationForm = document.querySelector("#registerForm");
  const messageElement = document.querySelector("#message");

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userInput = {
      fullName: registrationForm
        .querySelector('[name="fullname"]')
        .value.trim(),
      username: registrationForm
        .querySelector('[name="username"]')
        .value.trim(),
      password: registrationForm
        .querySelector('[name="password"]')
        .value.trim(),
      confirmPassword: registrationForm
        .querySelector('[name="passwordConfirmation"]')
        .value.trim(),
    };

    if (
      !userInput.fullName ||
      !userInput.username ||
      !userInput.password ||
      !userInput.confirmPassword
    ) {
      displayMessage("Please fill out all fields.", "danger");
      return;
    }

    if (userInput.password !== userInput.confirmPassword) {
      displayMessage("Passwords do not match.", "danger");
      return;
    }

    try {
      const response = await fetch(
        "http://microbloglite.us-east-2.elasticbeanstalk.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: userInput.fullName,
            username: userInput.username,
            password: userInput.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      registrationForm.reset();
      displayMessage("Registration successful!", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } catch (error) {
      console.error("Error during registration:", error);
      displayMessage("Registration failed. Please try again later.", "danger");
    }
  });

  function displayMessage(message, type) {
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
  }
});