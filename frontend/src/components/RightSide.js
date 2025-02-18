import React from 'react';

export default function RightSide({ reviewOutput }) {
  return (
    <div style={{
      width: '50vw',
      height: '100vh',
      backgroundColor: '#e8e8e8',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2>Code Review & Unit Tests</h2>
      
      {/* Review Output Box */}
      <div style={{
        background: "linear-gradient(180deg, #ffffff, #f0f0f0)",
        padding: '1rem',
        borderRadius: '5px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        maxHeight: '50vh',  // Set max height to 60% of viewport height
        overflowY: 'auto',  // Enable vertical scrolling
        border: '1px solid #ccc',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
        flexGrow: 1 // Allows it to grow within the available space
      }}>
        {reviewOutput || "No review yet..."}
      </div>
    </div>
  );
}
