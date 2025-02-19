import { useState } from "react";
import { Card, CardContent, Tabs, Tab, Box, Typography } from "@mui/material";

export default function RightSide({ reviewOutput, testReport, generatedTests }) {
  const [activeTab, setActiveTab] = useState("testReport");

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
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab value="testReport" label="Test Case Report" />
          <Tab value="generatedTests" label="Generated Test Code" />
        </Tabs>

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
