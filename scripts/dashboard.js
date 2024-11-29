import { checkUserState, logoutUser } from "./auth.js";

// Check if the user is logged in
checkUserState((user) => {
    document.getElementById("welcomeMessage").textContent = `Welcome, ${user.email}`;
});

// Logout button
document.getElementById("logoutButton").addEventListener("click", () => {
    logoutUser();
});
