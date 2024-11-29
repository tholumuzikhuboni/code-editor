import { registerUser } from "./auth.js";

document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form default behavior
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    
    console.log("Attempting signup with:", email, password);

    // Call the register function
    registerUser(email, password);
});
