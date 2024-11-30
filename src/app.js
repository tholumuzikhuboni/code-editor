// Get elements from the DOM
const htmlEditor = document.getElementById('htmlCode');
const cssEditor = document.getElementById('cssCode');
const jsEditor = document.getElementById('jsCode');
const preview = document.getElementById('preview');
const runButton = document.getElementById('runCode');
const downloadButton = document.getElementById('downloadCode');
const formatButton = document.getElementById('formatCode');
const saveButton = document.getElementById('saveCode');
const loadButton = document.getElementById('loadCode');

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

// Initialize Firestore
const db = getFirestore(app);

// Initialize CodeMirror editors with syntax highlighting
const htmlCM = CodeMirror.fromTextArea(htmlEditor, {
    mode: "htmlmixed",
    theme: "dracula",
    lineNumbers: true,
    matchBrackets: true
});

const cssCM = CodeMirror.fromTextArea(cssEditor, {
    mode: "css",
    theme: "dracula",
    lineNumbers: true,
    matchBrackets: true
});

const jsCM = CodeMirror.fromTextArea(jsEditor, {
    mode: "javascript",
    theme: "dracula",
    lineNumbers: true,
    matchBrackets: true
});

// Function to run the code and update the preview
function runCode() {
    runButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
    runButton.disabled = true;

    const htmlContent = htmlCM.getValue();
    const cssContent = `<style>${cssCM.getValue()}</style>`;
    const jsContent = `<script>${jsCM.getValue()}</script>`;

    const code = htmlContent + cssContent + jsContent;
    preview.srcdoc = code;

    setTimeout(() => {
        runButton.innerHTML = '<i class="fas fa-play"></i> Run Code';
        runButton.disabled = false;
    }, 1000);
}

// Function to download the code as a ZIP file
function downloadCode() {
    const htmlContent = htmlCM.getValue();
    const cssContent = cssCM.getValue();
    const jsContent = jsCM.getValue();

    const zip = new JSZip();
    zip.file("index.html", htmlContent);
    zip.file("style.css", cssContent);
    zip.file("script.js", jsContent);

    zip.generateAsync({ type: "blob" }).then(function (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "code_project.zip";
        link.click();
    });
}

// Function to format the code in all editors
function formatCode() {
    htmlCM.setValue(html_beautify(htmlCM.getValue(), { indent_size: 2 }));
    cssCM.setValue(css_beautify(cssCM.getValue(), { indent_size: 2 }));
    jsCM.setValue(js_beautify(jsCM.getValue(), { indent_size: 2 }));
}

// Function to save the code to Firestore
function saveCode() {
    const htmlContent = htmlCM.getValue();
    const cssContent = cssCM.getValue();
    const jsContent = jsCM.getValue();

    // Get the user ID (you should have authentication set up)
    const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : "guest";

    // Save to Firestore
    addDoc(collection(db, "user_codes"), {
        userId: userId,
        htmlCode: htmlContent,
        cssCode: cssContent,
        jsCode: jsContent,
        timestamp: new Date() // Optional: save the time the code was saved
    })
    .then(() => {
        alert("Code saved successfully!");
    })
    .catch((error) => {
        console.error("Error saving code: ", error);
        alert("Failed to save code!");
    });
}

// Function to load the code from Firestore
function loadCode() {
    const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : "guest";

    // Retrieve the latest saved code from Firestore for the current user
    const userCodesRef = collection(db, "user_codes");
    const q = query(userCodesRef, where("userId", "==", userId), orderBy("timestamp", "desc"), limit(1));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                // Set the loaded code into the editors
                htmlCM.setValue(data.htmlCode);
                cssCM.setValue(data.cssCode);
                jsCM.setValue(data.jsCode);

                alert("Code loaded successfully!");
            } else {
                alert("No saved code found!");
            }
        })
        .catch((error) => {
            console.error("Error loading code: ", error);
            alert("Failed to load code!");
        });
}

// Function to autocomplete HTML tags
function autoComplete(editor, char) {
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);
    const match = char === ">" ? line.match(/<(\w+)[^>]*>$/) : null;

    if (match) {
        const tagName = match[1];
        const autoClose = `</${tagName}>`;
        editor.replaceRange(autoClose, { line: cursor.line, ch: cursor.ch });
        editor.setCursor({ line: cursor.line, ch: cursor.ch });
    }
}

// Event listeners
runButton.addEventListener('click', runCode);
downloadButton.addEventListener('click', downloadCode);
formatButton.addEventListener('click', formatCode);
saveButton.addEventListener('click', saveCode);
loadButton.addEventListener('click', loadCode);

// Autocomplete for HTML tags
htmlCM.on('keypress', (editor, event) => {
    if (event.key === ">") autoComplete(htmlCM, ">");
});

// Automatically run the code when the user types (live preview effect)
htmlCM.on('change', runCode);
cssCM.on('change', runCode);
jsCM.on('change', runCode);

// Initialize with sample content
const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`;

const defaultCSS = `body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    text-align: center;
}`;

const defaultJS = `console.log('Hello, World!');`;

htmlCM.setValue(defaultHTML);
cssCM.setValue(defaultCSS);
jsCM.setValue(defaultJS);
