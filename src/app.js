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

// Function to save the code to local storage
function saveCode() {
    localStorage.setItem("htmlCode", htmlCM.getValue());
    localStorage.setItem("cssCode", cssCM.getValue());
    localStorage.setItem("jsCode", jsCM.getValue());
    alert("Code saved successfully!");
}

// Function to load the code from local storage
function loadCode() {
    const savedHTML = localStorage.getItem("htmlCode");
    const savedCSS = localStorage.getItem("cssCode");
    const savedJS = localStorage.getItem("jsCode");

    if (savedHTML || savedCSS || savedJS) {
        htmlCM.setValue(savedHTML || "");
        cssCM.setValue(savedCSS || "");
        jsCM.setValue(savedJS || "");
        alert("Code loaded successfully!");
    } else {
        alert("No saved code found!");
    }
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
