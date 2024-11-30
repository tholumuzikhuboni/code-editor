import { checkUserState, logoutUser } from "./auth.js";

// Check if the user is logged in
checkUserState((user) => {
    // Get the name or fallback to email
    const userName = user.displayName || user.email;
    
    // Update the welcome message
    document.getElementById("welcomeMessage").textContent = `Welcome, ${userName}`;
});

// Logout button
document.getElementById("logoutButton").addEventListener("click", () => {
    logoutUser();
});
