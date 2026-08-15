import React from 'react';
import './Common.css';

const Error = ({ message }) => {
  return (
    <div className="error-container glass-panel">
      <h4>Something went wrong</h4>
      <p>{message || 'Failed to fetch resources. Please check your connection and try again.'}</p>
    </div>
  );
};

export default Error;
