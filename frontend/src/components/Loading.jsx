import React from 'react';
import './Common.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading CodePilot data...</p>
    </div>
  );
};

export default Loading;
