import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Editor from "react-monaco-editor";

export default function LeftSide({ setReviewOutput, setTestReport, setGeneratedTests, setLang, setUserCode, setCmd }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const editorRef = useRef(null); // Reference to the Monaco Editor instance

  // Function to update Monaco Editor layout
  const updateEditorLayout = () => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  };

  // Attach resize event listener
  useEffect(() => {
    window.addEventListener("resize", updateEditorLayout);
    return () => window.removeEventListener("resize", updateEditorLayout);
  }, []);

  // Send code to Flask backend for execution
  const handleCompileRun = async () => {
    if (!code.trim()) {
      setOutput("Error: Code is empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/execute", {
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
    setGeneratedTests('Please Wait');
    setTestReport('');
    setLang(language);
    setUserCode(code);
    if (!code.trim()) {
      setOutput("Error: Code is empty.");
      return;
    }

    try {
      setReviewOutput("Please Wait...")
      const response = await axios.post("http://localhost:5000/review", {
        code,
        language,
      });
      setReviewOutput(response.data.ai_suggestions || response.data.lint_results || "No review feedback.");

      const response1 = await axios.post("http://localhost:5000/test", {
        code,
        language,
      });
      console.log(response1);
      const parsedTestReport = parseTestReport(response1.data.test_results, language);

      setTestReport(parsedTestReport);
      setGeneratedTests(response1.data.test_cases || "No generated tests available.");
      setCmd(response1.data.test_results);
    } catch (error) {
      setOutput("Error: Failed to review code.");
      console.error("Review error:", error);
    }
  };

  return (
    <div
      style={{
        width: "50vw",
        height: "105vh",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        background: "#171717",
        color: "#fff",
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Editor
          ref={editorRef}
          height="100%"
          width="100%"
          language={language}
          theme="vs-dark"
          value={code}
          style={{
            outline: "none",  // Remove the outline
            border: "none",   // Remove any border
          }}
          onChange={(newCode) => setCode(newCode)}
          options={{
            lineNumbers: "on",
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
          editorDidMount={(editor) => {
            editorRef.current = editor;
            updateEditorLayout(); // Ensure correct layout on mount
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

const parseTestReport = (testResults, language) => {
  let total = 0, passed = 0, failed = 0, time = "N/A";

  if (language === "java") {
    const match = testResults.match(/Tests run: (\d+), Failures: (\d+), Errors: (\d+), Skipped: (\d+)/);
    if (match) {
      total = parseInt(match[1], 10);
      failed = parseInt(match[2], 10) + parseInt(match[3], 10);
      passed = total - failed;
    }
    const timeMatch = testResults.match(/Total time:\s+([\d.]+) s/);
    if (timeMatch) {
      time = `${timeMatch[1]} s`;
    }

  } else if (language === "python") {
    const match = testResults.match(/collected (\d+) items/);
    if (match) {
      total = parseInt(match[1], 10);
    }
    const passMatch = testResults.match(/(\d+) passed/);
    if (passMatch) {
      passed = parseInt(passMatch[1], 10);
    }
    failed = total - passed;

    // **Updated Regex to Capture Execution Time Correctly**
    const timeMatch = testResults.match(/(\d+\.\d+)s\s*=\s*$/m);
    if (!timeMatch) {
      const fallbackMatch = testResults.match(/(\d+\.\d+)s/);
      if (fallbackMatch) {
        time = `${fallbackMatch[1]} s`;
      }
    } else {
      time = `${timeMatch[1]} s`;
    }

  } else if (language === "javascript") {
    try {
      // **Extract the JSON part from the testResults**
      const jsonStart = testResults.indexOf("{");
      const jsonEnd = testResults.lastIndexOf("}");
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = testResults.substring(jsonStart, jsonEnd + 1);
        const parsedResults = JSON.parse(jsonString);

        if (parsedResults.stats) {
          total = parsedResults.stats.tests || 0;
          passed = parsedResults.stats.passes || 0;
          failed = parsedResults.stats.failures || 0;
          time = parsedResults.stats.duration ? `${parsedResults.stats.duration} ms` : "N/A";
        }
      }
    } catch (error) {
      console.error("Error parsing JavaScript test report:", error);
    }
  }

  return { total, passed, failed, time };
};
