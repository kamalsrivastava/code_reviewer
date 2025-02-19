import React, { useState } from 'react';
import './App.css';
import LeftSide from './components/LeftSide';
import RightSide from './components/RightSide';

function App() {
  
  const [reviewOutput, setReviewOutput] = useState('');
  const [testReport, setTestReport] = useState({});
  const [generatedTests, setGeneratedTests] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <LeftSide setReviewOutput={setReviewOutput} setTestReport={setTestReport} setGeneratedTests={setGeneratedTests}/>
      <RightSide reviewOutput={reviewOutput} testReport={testReport} generatedTests={generatedTests}/>
    </div>
  );
}

export default App;
