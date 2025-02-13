var editor;

// Load Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs' } });
require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById("editor-container"), {
        value: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World in Java!");\n    }\n}`,
        language: "java",
        theme: "vs-dark",
        automaticLayout: true
    });
});

// Run Code Function
function runCode() {
    const code = editor.getValue();
    const userInput = document.getElementById("userInput").value;

    fetch("/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, input: userInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("output").textContent = data.output;
    })
    .catch(error => {
        document.getElementById("output").textContent = "Error running code!";
    });
}

// Resizable Split Panel (Fix for Shift Issue)
const resizer = document.getElementById("resizer");
const leftPanel = document.querySelector(".left");
const rightPanel = document.querySelector(".right");

let isResizing = false;

resizer.addEventListener("mousedown", function (event) {
    isResizing = true;
    document.addEventListener("mousemove", resizePanels);
    document.addEventListener("mouseup", () => {
        isResizing = false;
        document.removeEventListener("mousemove", resizePanels);
    });
});

function resizePanels(event) {
    if (!isResizing) return;
    let leftWidth = event.clientX / window.innerWidth * 100;
    if (leftWidth < 30) leftWidth = 30; // Minimum width
    if (leftWidth > 70) leftWidth = 70; // Maximum width
    leftPanel.style.flex = leftWidth;
    rightPanel.style.flex = 100 - leftWidth;
    editor.layout(); // Fix Monaco Editor Resizing
}
