"use strict";

class RegistrationForm {
    constructor(formElement) {
      this.formElement = formElement;
      this.messageElement = document.querySelector("#message");
      this.formElement.addEventListener("submit", this.handleSubmit.bind(this));
    }
  
    async handleSubmit(event) {
      event.preventDefault();
  
      const userInput = {
        fullName: this.formElement.querySelector('[name="fullname"]').value.trim(),
        username: this.formElement.querySelector('[name="username"]').value.trim(),
        password: this.formElement.querySelector('[name="password"]').value.trim(),
        confirmPassword: this.formElement.querySelector('[name="passwordConfirmation"]').value.trim(),
      };
  
      if (!userInput.fullName || !userInput.username || !userInput.password || !userInput.confirmPassword) {
        this.displayMessage("Please fill out all fields.", "danger");
        return;
      }
  
      if (userInput.password !== userInput.confirmPassword) {
        this.displayMessage("Passwords do not match.", "danger");
        return;
      }
  
      try {
        const response = await fetch("https://microbloglite.onrender.com/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: userInput.fullName,
            username: userInput.username,
            password: userInput.password,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        }
  
        this.formElement.reset();
        this.displayMessage("Registration successful!", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } catch (error) {
        console.error("Error during registration:", error);
        this.displayMessage("Registration failed. Please try again later.", "danger");
      }
    }
  
    displayMessage(message, type) {
      this.messageElement.textContent = message;
      this.messageElement.className = `message ${type}`;
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = new RegistrationForm(document.querySelector("#registerForm"));
  });