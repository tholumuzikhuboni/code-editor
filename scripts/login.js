import { loginUser } from "./auth.js";

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from refreshing page
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    loginUser(email, password); // Call loginUser function
});
