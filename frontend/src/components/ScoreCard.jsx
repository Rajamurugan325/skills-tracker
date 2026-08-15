import React from 'react';
import './ScoreCard.css';

const ScoreCard = ({ score, total, title, category }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  return (
    <div className="score-card glass-panel">
      <div className="score-card-circle" style={{ '--percentage': percentage }}>
        <div className="score-card-inner">
          <h2>{percentage}%</h2>
          <span>{score} / {total} Correct</span>
        </div>
      </div>
      <div className="score-card-details">
        <h4>{title || 'Quiz Result'}</h4>
        {category && <span className="category-tag">{category}</span>}
      </div>
    </div>
  );
};

export default ScoreCard;
