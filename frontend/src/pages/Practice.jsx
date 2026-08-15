import React, { useState, useEffect } from 'react';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import './Practice.css';

const Practice = () => {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRandomQuestion = async () => {
    setLoading(true);
    setSelectedOption('');
    setSubmitted(false);
    try {
      const response = await api.get('/api/questions/random');
      setQuestion(response.data);
    } catch (err) {
      setError('Failed to fetch a practice question.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  const handleSubmit = async () => {
    if (!selectedOption || submitted) return;
    
    const correct = selectedOption === question.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);

    try {
      await api.post('/api/questions/submit', {
        questionId: question.id,
        selectedAnswer: selectedOption
      });
    } catch (err) {
      console.error('Failed to sync practice stats in the database.', err);
    }
  };

  if (loading && !question) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="practice-wrapper">
      <div className="practice-header-section">
        <div className="title-area">
          <HelpCircle className="card-icon indigo" />
          <div>
            <h2>Practice Area</h2>
            <p>Adaptive mode active. Weak topics are loaded automatically.</p>
          </div>
        </div>
        <button onClick={fetchRandomQuestion} className="glass-button secondary">
          Skip Question
        </button>
      </div>

      {question && (
        <QuestionCard
          question={question}
          selectedOption={selectedOption}
          onOptionSelect={(opt) => !submitted && setSelectedOption(opt)}
        />
      )}

      {!submitted ? (
        <div className="action-area">
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="glass-button submit-btn"
          >
            Check Answer
          </button>
        </div>
      ) : (
        <div className="feedback-section glass-panel">
          <div className="feedback-header">
            {isCorrect ? (
              <span className="correct-badge">
                <CheckCircle2 size={18} />
                Correct! Well done.
              </span>
            ) : (
              <span className="incorrect-badge">
                <XCircle size={18} />
                Incorrect. Correct Answer: {question.correctAnswer}
              </span>
            )}
          </div>

          <div className="explanation-area">
            <h5>Explanation:</h5>
            <p>{question.explanation}</p>
          </div>

          <button onClick={fetchRandomQuestion} className="glass-button next-btn">
            <span>Next Question</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Practice;
