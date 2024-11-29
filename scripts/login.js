import { loginUser } from "./auth.js";

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form default behavior
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    console.log("Attempting login with:", email, password); //

    // Call the login function
    loginUser(email, password);
});
