import { registerUser } from "./auth.js";

document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from refreshing page
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    registerUser(email, password); // Call registerUser function
});
