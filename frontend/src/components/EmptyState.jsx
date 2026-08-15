import React from 'react';
import './Common.css';

const EmptyState = ({ title, message, actionText, onAction }) => {
  return (
    <div className="empty-container glass-panel">
      <h3>{title || 'No data found'}</h3>
      <p>{message || 'There are no active records in this section yet.'}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="glass-button">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
