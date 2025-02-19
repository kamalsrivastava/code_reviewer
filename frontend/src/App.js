import React, { useState } from 'react';
import './App.css';
import LeftSide from './components/LeftSide';
import RightSide from './components/RightSide';

function App() {
  
  const [reviewOutput, setReviewOutput] = useState('');
  const [testReport, setTestReport] = useState({});
  const [generatedTests, setGeneratedTests] = useState('');
  const [language, setLang] = useState('');
  const [userCode, setUserCode] = useState('');
  const [cmd, setCmd] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <LeftSide setReviewOutput={setReviewOutput} setTestReport={setTestReport} setGeneratedTests={setGeneratedTests} setLang={setLang} setUserCode={setUserCode} setCmd={setCmd} />
      <RightSide reviewOutput={reviewOutput} testReport={testReport} generatedTests={generatedTests} language={language} userCode={userCode} cmd={cmd}/>
    </div>
  );
}

export default App;
