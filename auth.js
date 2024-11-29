import { auth } from "./firebase.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "firebase/auth";

// Register user
export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful!");
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Signup error:", error.message);
        alert(error.message);
    }
}

// Login user
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Login error:", error.message);
        alert(error.message);
    }
}

// Logout user
export async function logoutUser() {
    try {
        await signOut(auth);
        alert("Logged out!");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout error:", error.message);
        alert(error.message);
    }
}

// Check user state
export function checkUserState(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user);
        } else {
            window.location.href = "login.html";
        }
    });
}
