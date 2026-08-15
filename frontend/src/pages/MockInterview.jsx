import React, { useState } from 'react';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Users, Play, Award, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import './MockInterview.css';

const MockInterview = () => {
  const [activeStep, setActiveStep] = useState(0); // 0: Lobby, 1: Active, 2: Scorecard
  const [interviewId, setInterviewId] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [questionIdx, setQuestionIdx] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [scorecard, setScorecard] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startMockInterview = async () => {
    setLoading(true);
    setError('');
    setSelectedOption('');
    try {
      const response = await api.post('/api/mock-interview/start');
      setInterviewId(response.data.mockInterviewId);
      setCurrentQuestion(response.data.firstQuestion);
      setCurrentRound(response.data.currentRound);
      setQuestionIdx(response.data.questionIndex);
      setActiveStep(1);
    } catch (err) {
      setError('Failed to start the mock interview session.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedOption || loading) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/mock-interview/submit', {
        mockInterviewId: interviewId,
        questionId: currentQuestion.id,
        selectedAnswer: selectedOption
      });

      setSelectedOption('');
      if (response.data.finished) {
        setScorecard(response.data.scorecard);
        setActiveStep(2);
      } else {
        setCurrentQuestion(response.data.nextQuestion);
        setCurrentRound(response.data.currentRound);
        setQuestionIdx(response.data.questionIndex);
      }
    } catch (err) {
      setError('Failed to submit response.');
    } finally {
      setLoading(false);
    }
  };

  const getRoundName = (roundNum) => {
    switch (roundNum) {
      case 1: return 'Round 1: Java Core & OOP';
      case 2: return 'Round 2: SQL & Database Transactions';
      case 3: return 'Round 3: Data Structures & Algorithms';
      case 4: return 'Round 4: General Technical Interview';
      default: return 'Mock Interview';
    }
  };

  if (loading && activeStep !== 1) return <Loading />;
  if (error) return <Error message={error} />;

  // 1. Lobby View
  if (activeStep === 0) {
    return (
      <div className="mock-lobby-wrapper">
        <div className="lobby-intro glass-panel">
          <Users className="lobby-intro-icon" />
          <h2>Multi-Round Mock Interview</h2>
          <p>
            Test your comprehensive skills in an industrial-level mock interview. The assessment 
            is split into 4 sequential rounds, testing 5 questions each.
          </p>
        </div>

        <div className="rounds-summary-grid">
          <div className="round-card glass-panel">
            <span className="round-num">01</span>
            <h4>Java Programming</h4>
            <p>Syntax, classes, collections, garbage collection, and multithreading.</p>
          </div>
          <div className="round-card glass-panel">
            <span className="round-num">02</span>
            <h4>Database Systems</h4>
            <p>Table joins, nested SELECTs, constraints, and ACID properties.</p>
          </div>
          <div className="round-card glass-panel">
            <span className="round-num">03</span>
            <h4>Algorithms (DSA)</h4>
            <p>Arrays, linked lists, recursive branches, trees, and searching.</p>
          </div>
          <div className="round-card glass-panel">
            <span className="round-num">04</span>
            <h4>General Technical</h4>
            <p>A comprehensive mix of engineering concepts and advanced syntax.</p>
          </div>
        </div>

        <div className="lobby-actions">
          <button onClick={startMockInterview} className="glass-button launch-mock-btn">
            <Play size={18} />
            <span>Launch Complete Mock Interview</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Active Mock View
  if (activeStep === 1 && currentQuestion) {
    return (
      <div className="mock-active-wrapper">
        <div className="mock-round-indicator glass-panel">
          <h4>{getRoundName(currentRound)}</h4>
          <span className="q-badge">Question {questionIdx} of 20</span>
        </div>

        <ProgressBar current={questionIdx} total={20} />

        <QuestionCard
          question={currentQuestion}
          selectedOption={selectedOption}
          onOptionSelect={(opt) => setSelectedOption(opt)}
        />

        <div className="action-area">
          <button
            onClick={submitAnswer}
            disabled={!selectedOption || loading}
            className="glass-button submit-btn"
          >
            {loading ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </div>
    );
  }

  // 3. Scorecard / Results View
  if (activeStep === 2 && scorecard) {
    const totalPercentage = Math.round((scorecard.totalScore / 20) * 100);
    return (
      <div className="scorecard-wrapper">
        {/* Score Header */}
        <div className="scorecard-header glass-panel">
          <Award size={48} className="text-indigo" />
          <h2>Interview Scorecard</h2>
          <div className="score-summary-grid">
            <div className="score-widget">
              <h1>{scorecard.totalScore} <span>/ 20</span></h1>
              <p>Total Correct Answers</p>
            </div>
            <div className="score-widget">
              <h1>{totalPercentage}%</h1>
              <p>Aggregate Readiness Rating</p>
            </div>
          </div>
        </div>

        {/* Round Performance Breaks */}
        <div className="scorecard-section glass-panel">
          <h3>Performance Breakdown</h3>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-meta">
                <span>Java Core Round</span>
                <strong>{scorecard.javaScore} / 5 Correct</strong>
              </div>
              <div className="breakdown-bar-track"><div className="breakdown-bar-fill" style={{ width: `${(scorecard.javaScore/5)*100}%` }}></div></div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-meta">
                <span>Database SQL Round</span>
                <strong>{scorecard.sqlScore} / 5 Correct</strong>
              </div>
              <div className="breakdown-bar-track"><div className="breakdown-bar-fill" style={{ width: `${(scorecard.sqlScore/5)*100}%` }}></div></div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-meta">
                <span>DSA & Algorithms Round</span>
                <strong>{scorecard.dsaScore} / 5 Correct</strong>
              </div>
              <div className="breakdown-bar-track"><div className="breakdown-bar-fill" style={{ width: `${(scorecard.dsaScore/5)*100}%` }}></div></div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-meta">
                <span>General Technical Round</span>
                <strong>{scorecard.techScore} / 5 Correct</strong>
              </div>
              <div className="breakdown-bar-track"><div className="breakdown-bar-fill" style={{ width: `${(scorecard.techScore/5)*100}%` }}></div></div>
            </div>
          </div>
        </div>

        {/* General Feedback Block */}
        <div className="scorecard-section feedback-summary glass-panel">
          <h3>Evaluation Feedback</h3>
          <p>{scorecard.feedbackSummary}</p>
        </div>

        {/* Strengths & Weakness Lists */}
        <div className="scorecard-grid-bottom">
          <div className="scorecard-card glass-panel">
            <div className="card-header-with-icon">
              <CheckCircle className="card-icon green" />
              <h3>Identified Strengths</h3>
            </div>
            <ul className="dashboard-list">
              {scorecard.strongAreas.map((area, i) => (
                <li key={i} className="list-item-ok">{area}</li>
              ))}
            </ul>
          </div>

          <div className="scorecard-card glass-panel">
            <div className="card-header-with-icon">
              <AlertTriangle className="card-icon red" />
              <h3>Improvement Recommendations</h3>
            </div>
            <ul className="dashboard-list">
              {scorecard.recommendations.map((rec, i) => (
                <li key={i} className="list-item-warn">{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="results-footer">
          <button onClick={() => setActiveStep(0)} className="glass-button">
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MockInterview;
