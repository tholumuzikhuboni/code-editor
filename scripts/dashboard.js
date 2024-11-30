import { checkUserState, logoutUser } from "./auth.js";
import { db } from "./firebase.js"; // Assuming you have initialized Firestore in this file
import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Check if the user is logged in
checkUserState((user) => {
    // Display the user's email in the welcome message
    document.getElementById("welcomeMessage").textContent = `Welcome, ${user.email}`;
});

// Logout button
document.getElementById("logoutButton").addEventListener("click", () => {
    logoutUser();
});

// Saving the project code to Firestore
document.getElementById("saveCode").addEventListener("click", async () => {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You need to log in to save your projects.");
        return;
    }

    const htmlCode = document.getElementById("htmlCode").value;
    const cssCode = document.getElementById("cssCode").value;
    const jsCode = document.getElementById("jsCode").value;

    if (!htmlCode && !cssCode && !jsCode) {
        alert("You need to write some code before saving.");
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "projects"), {
            userId: user.uid,
            htmlCode,
            cssCode,
            jsCode,
            createdAt: new Date(),
        });
        alert("Project saved successfully!");
    } catch (error) {
        console.error("Error saving project: ", error);
        alert("Error saving project. Please try again.");
    }
});

// Load saved projects
async function loadProjects() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You need to log in to view your saved projects.");
        return;
    }

    const projectsContainer = document.getElementById("projectsContainer");
    projectsContainer.innerHTML = ""; // Clear any previous projects

    try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            const project = doc.data();
            if (project.userId === user.uid) {
                const projectElement = document.createElement("div");
                projectElement.classList.add("project-card");
                projectElement.innerHTML = `
                    <h5>Project created on: ${new Date(project.createdAt.seconds * 1000).toLocaleString()}</h5>
                    <button class="btn btn-secondary" onclick="loadProject('${doc.id}')">Load Project</button>
                    <button class="btn btn-danger" onclick="deleteProject('${doc.id}')">Delete</button>
                `;
                projectsContainer.appendChild(projectElement);
            }
        });
    } catch (error) {
        console.error("Error loading projects: ", error);
        alert("Error loading projects. Please try again.");
    }
}

// Load project into the editor
window.loadProject = async (projectId) => {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You need to log in to load your projects.");
        return;
    }

    try {
        const projectDoc = await db.collection("projects").doc(projectId).get();
        const project = projectDoc.data();
        if (project.userId === user.uid) {
            document.getElementById("htmlCode").value = project.htmlCode;
            document.getElementById("cssCode").value = project.cssCode;
            document.getElementById("jsCode").value = project.jsCode;
            alert("Project loaded into the editor!");
        } else {
            alert("You don't have permission to load this project.");
        }
    } catch (error) {
        console.error("Error loading project: ", error);
        alert("Error loading project. Please try again.");
    }
};

// Delete a project
window.deleteProject = async (projectId) => {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You need to log in to delete your projects.");
        return;
    }

    try {
        await db.collection("projects").doc(projectId).delete();
        alert("Project deleted successfully!");
        loadProjects(); // Reload the projects
    } catch (error) {
        console.error("Error deleting project: ", error);
        alert("Error deleting project. Please try again.");
    }
};

// Load projects when the page loads
window.addEventListener("load", loadProjects);
