import React, { useState } from "react";
import axios from "axios";
import Editor from "react-monaco-editor";

export default function LeftSide({ setReviewOutput }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  // Send code to Flask backend for execution
  const handleCompileRun = async () => {
    if (!code.trim()) {
      setOutput("Error: Code is empty.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/execute", {
        code,
        language,
      });

      setOutput(response.data.output || "No output.");
    } catch (error) {
      setOutput("Error: Failed to execute code.");
      console.error("Execution error:", error);
    }
  };

  // Send code to Flask backend for review
  const handleCodeReview = async () => {
    if (!code.trim()) {
      setOutput("Error: Code is empty.");
      return;
    }

    try {
      setReviewOutput("Please Wait...")
      const response = await axios.post("http://127.0.0.1:5000/review", {
        code,
        language,
      });
      setReviewOutput(response.data.ai_suggestions || "No review feedback.");

      const response1 = await axios.post("http://127.0.0.1:5000/test", {
        code,
        language,
      });
      console.log(response1);

      // setReviewOutput(response.data.ai_suggestions || "No review feedback.");
    } catch (error) {
      setOutput("Error: Failed to review code.");
      console.error("Review error:", error);
    }
  };

  return (
    <div
      style={{
        width: "50vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        background: "radial-gradient(circle at top left, #141E30, rgb(10, 10, 10))",
        color: "#fff",
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top Bar: Language Selection + Compile/Run + Code Review */}
      <div
        style={{
          height: "10%",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
        }}
      >
        <div>
          <label htmlFor="language" style={{ marginRight: "0.5rem", color: "#fff" }}>
            Language:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              backgroundColor: "transparent",
              color: "#000",
              border: "1px solid #ccc",
              padding: "0.3rem",
            }}
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div>
          <button
            onClick={handleCompileRun}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "0.5rem",
              transition: "background 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.4)")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.2)")}
          >
            Compile / Run
          </button>
          <button
            onClick={handleCodeReview}
            style={{
              backgroundColor: "rgba(0,255,127,0.2)",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(0,255,127,0.4)")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "rgba(0,255,127,0.2)")}
          >
            Code Review
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div style={{ height: "60%", borderTop: "1px solid rgba(255,255,255,0.2)" }}>
        <Editor
          height="100%"
          width="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(newCode) => setCode(newCode)}
          options={{
            lineNumbers: "on",
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      </div>

      {/* Output Panel */}
      <div
        style={{
          height: "30%",
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(6px)",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          padding: "1rem",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "14px",
          whiteSpace: "pre-wrap",
          color: output.includes("Error") ? "#ff5555" : "#00ff99",
        }}
      >
        <h4 style={{ margin: "0 0 0.5rem 0", fontWeight: "normal", color: "#ffcc00" }}>Output</h4>
        <pre style={{ margin: 0 }}>{output || "No output yet..."}</pre>
      </div>
    </div>
  );
}
