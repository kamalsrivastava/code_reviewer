import React, { useState } from 'react';
import './App.css';
import LeftSide from './components/LeftSide';
import RightSide from './components/RightSide';

function App() {
  
  const [reviewOutput, setReviewOutput] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <LeftSide setReviewOutput={setReviewOutput}/>
      <RightSide reviewOutput={reviewOutput}/>
    </div>
  );
}

export default App;
