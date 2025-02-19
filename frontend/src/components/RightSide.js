import { useState, useEffect } from "react";
import { Card, CardContent, Tabs, Tab, Button } from "@mui/material";
import jsPDF from "jspdf";

export default function RightSide({ reviewOutput, testReport, generatedTests, language, userCode, cmd }) {
  const [activeTab, setActiveTab] = useState("testReport");
  const [isDownloadEnabled, setIsDownloadEnabled] = useState(false);

  // Enable Download button after receiving testReport
  useEffect(() => {
    if (generatedTests!="") {
      setIsDownloadEnabled(true);
    }
  }, [testReport]);

  const handleDownload = () => {
    const doc = new jsPDF();
    let yPosition = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height - 10;
  
    // Function to add text and handle page breaks
    const addText = (text, x, y) => {
      const lines = doc.splitTextToSize(text, 180); // Split long lines
      lines.forEach((line) => {
        if (y > pageHeight) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, x, y);
        y += lineHeight;
      });
      return y;
    };
  
    // Add Title
    doc.setFontSize(18);
    yPosition = addText("AI Powered Code-Review and Testing", 40, yPosition);
  
    // Add Language
    doc.setFontSize(12);
    yPosition += 5;
    yPosition = addText(`Language: ${language}`, 10, yPosition);
  
    // Add User's Code
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("Your Code:", 10, yPosition);
    doc.setFontSize(10);
    yPosition += 5;
    yPosition = addText(userCode, 10, yPosition);
  
    // Add Code Review Output
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("Code Review:", 10, yPosition);
    doc.setFontSize(10);
    yPosition += 5;
    yPosition = addText(reviewOutput || "No review available.", 10, yPosition);
  
    // Add Generated Tests
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("Generated Tests:", 10, yPosition);
    doc.setFontSize(10);
    yPosition += 5;
    yPosition = addText(generatedTests || "No generated tests available.", 10, yPosition);
  
    // Add Test Report
    doc.setFontSize(14);
    yPosition += 10;
    yPosition = addText("Test Report:", 10, yPosition);
    doc.setFontSize(10);
    yPosition += 5;
    yPosition = addText(cmd || "No test report available.", 10, yPosition);
  
    // Save PDF
    doc.save("CodeReview_Report.pdf");
  };
  

  return (
    <div style={{ width: "50vw", height: "100vh", backgroundColor: "#0D1A38", padding: "1rem", display: "flex", flexDirection: "column" }}>
      <h2 style={{ color: "#FFFFFF", marginBottom: "2.3rem" }}>Code Review & Unit Tests</h2>

      {/* Review Output Box */}
      <div
        style={{
          backgroundColor: "#f4f4f4",
          padding: "1rem",
          borderRadius: "5px",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          maxHeight: "30vh",
          overflowY: "auto",
          border: "1px solid #ccc",
          boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
          flexGrow: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {reviewOutput === "Please Wait..." ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "4px solid rgba(0, 0, 0, 0.2)",
                  borderTopColor: "#007bff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <span>Loading...</span>
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "left",
            }}
          >
            {reviewOutput || "No review yet..."}
          </div>
        )}
      </div>

      <Card sx={{ marginTop: "1rem", padding: "1rem", position: "relative", minHeight: "180px"  }}>
        {generatedTests == "Please Wait" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#fff",
                borderRadius: "5px",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "4px solid rgba(0, 0, 0, 0.2)",
                    borderTopColor: "#007bff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <span>Loading...</span>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab value="testReport" label="Test Case Report" />
            <Tab value="generatedTests" label="Generated Test Code" />
          </Tabs>
          <Button variant="contained" onClick={handleDownload} disabled={!isDownloadEnabled} sx={{ padding: "2px 6px", fontSize: "0.50rem", position: "relative", minWidth: "auto", right: "8px", top: '12%', transform: "translateY(-50%)" }}>
            Download Report
          </Button>
        </div>

        {activeTab === "testReport" && (
          <CardContent>
            <h3>Test Case Report</h3>
            <p><strong>Total Test Cases:</strong> {testReport?.total || 0}</p>
            <p><strong>Passed:</strong> {testReport?.passed || 0}</p>
            <p><strong>Failed:</strong> {testReport?.failed || 0}</p>
            <p><strong>Execution Time:</strong> {testReport?.time || "N/A"}</p>
          </CardContent>
        )}

        {activeTab === "generatedTests" && (
          <CardContent sx={{ paddingBottom: "1.5rem" }}>
            <h3>Generated Test Code</h3>
            <pre style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "5px", fontFamily: "monospace", whiteSpace: "pre-wrap", overflowX: "auto", overflowY: 'auto', maxHeight: '50vh', marginBottom: "2rem", border: "1px solid #ccc", boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)" }}>
              {generatedTests || "No generated tests available."}
            </pre>
          </CardContent>
        )}
      </Card>
      {/* CSS for Loader Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

    </div>
  );
}
