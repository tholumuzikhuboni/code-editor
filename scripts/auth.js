import { 
    initializeApp 
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    updateEmail, 
    sendPasswordResetEmail, 
    reauthenticateWithCredential, 
    EmailAuthProvider 
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc 
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Firebase configuration
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
const db = getFirestore(app);

console.log("Firebase initialized:", app); // Debugging statement

// Register user
export async function registerUser(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Signup successful:", userCredential);

        // Create a new user profile in Firestore
        await createUserProfile(user, displayName);

        alert("Signup successful!");
        window.location.href = "dashboard.html"; // Redirect after signup
    } catch (error) {
        console.error("Signup error:", error.message);
        alert(error.message); // Show error message
    }
}

// Create user profile in Firestore
async function createUserProfile(user, displayName) {
    try {
        const userRef = doc(db, "users", user.uid); // Store user in the 'users' collection
        await setDoc(userRef, {
            email: user.email,
            displayName: displayName || "Anonymous", // If no display name, set to "Anonymous"
            createdAt: new Date()
        });
        console.log("User profile created successfully!");
    } catch (error) {
        console.error("Error creating user profile in Firestore:", error.message);
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

// Update user's email
export async function updateUserEmail(newEmail) {
    try {
        await updateEmail(auth.currentUser, newEmail);
        alert("Email updated successfully!");
    } catch (error) {
        console.error("Error updating email:", error.message);
        alert(error.message);
    }
}

// Send password reset email
export async function resetPassword() {
    try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        alert("Password reset email sent!");
    } catch (error) {
        console.error("Error resetting password:", error.message);
        alert(error.message);
    }
}

// Reauthenticate user (for secure actions like updating email)
export async function reauthenticateUser(password) {
    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
        alert("Reauthentication successful!");
    } catch (error) {
        console.error("Error reauthenticating:", error.message);
        alert(error.message);
    }
}

// Get user profile from Firestore
export async function getUserProfile(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data(); // Return user data
        } else {
            console.log("No such user profile!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile:", error.message);
        return null;
    }
}

// Update user profile in Firestore
export async function updateUserProfile(userId, updatedData) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, updatedData);
        console.log("User profile updated successfully!");
    } catch (error) {
        console.error("Error updating user profile:", error.message);
    }
}
