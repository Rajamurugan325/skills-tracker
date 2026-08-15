import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, selectedOption, onOptionSelect }) => {
  if (!question) return null;

  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD },
  ];

  return (
    <div className="question-card glass-panel">
      <div className="question-header">
        <span className="category-tag">{question.category}</span>
        <span className={`difficulty-tag ${question.difficulty?.toLowerCase()}`}>
          {question.difficulty}
        </span>
      </div>

      <h3 className="question-text">{question.questionText}</h3>

      <div className="options-grid">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onOptionSelect(opt.key)}
              className={`option-button glass-panel ${isSelected ? 'selected' : ''}`}
            >
              <span className="option-badge">{opt.key}</span>
              <span className="option-text">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
