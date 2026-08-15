import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span>Progress: {current} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
