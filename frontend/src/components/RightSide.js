export default function RightSide({ reviewOutput }) {
  return (
    <div
      style={{
        width: "50vw",
        height: "100vh",
        backgroundColor: "#0D1A38",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
<h2 style={{ color: "#FFFFFF" , marginBottom: "2.3rem"}}>Code Review & Unit Tests</h2>

      {/* Review Output Box */}
      <div
        style={{
          backgroundColor: "#f4f4f4",
          padding: "1rem",
          borderRadius: "5px",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          maxHeight: "50vh",
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