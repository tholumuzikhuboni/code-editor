import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
