import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyD8kL3cEoh2t_QuiHqk0x21BNV9knd01rU",
    authDomain: "code-editor-efd72.firebaseapp.com",
    projectId: "code-editor-efd72",
    storageBucket: "code-editor-efd72.firebasestorage.app",
    messagingSenderId: "28165650101",
    appId: "1:28165650101:web:16c852e94780ac5f11b0fc",
    measurementId: "G-82HBJ4TR9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

console.log("Firebase initialized:", app); // Debugging statement

// Register user
export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Signup successful:", userCredential);
        alert("Signup successful!");
        window.location.href = "dashboard.html"; // Redirect after signup
    } catch (error) {
        console.error("Signup error:", error.message);
        alert(error.message); // Show error message
    }
}

// Login user
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful:", userCredential); // Debugging statement
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect after login
    } catch (error) {
        console.error("Login error:", error.message);
        alert(error.message); // Show error message
    }
}

// Logout user
export async function logoutUser() {
    try {
        await signOut(auth);
        alert("Logged out!");
        window.location.href = "index.html"; // Redirect to home page
    } catch (error) {
        console.error("Logout error:", error.message);
        alert(error.message); // Show error message
    }
}

// Check user state
export function checkUserState(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user); // Pass user data to callback
        } else {
            window.location.href = "login.html"; // Redirect to login if not logged in
        }
    });
}
