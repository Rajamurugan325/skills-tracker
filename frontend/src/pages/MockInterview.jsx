import React, { useState } from 'react';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Users, Play, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import './MockInterview.css';

const MockInterview = () => {
  const [activeStep, setActiveStep] = useState(0); // 0: Lobby, 1: Active, 2: Scorecard
  const [interviewId, setInterviewId] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundName, setRoundName] = useState('Round 1');
  const [questionIdx, setQuestionIdx] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [scorecard, setScorecard] = useState(null);

  const [interviewType, setInterviewType] = useState('TECHNICAL'); // TECHNICAL, PLACEMENT, COMPANY, INDIVIDUAL, MULTIPLE
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [companyStyle, setCompanyStyle] = useState('GOOGLE');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allTracks = [
    { key: 'JAVA', label: 'Java Core' },
    { key: 'SQL', label: 'Database & SQL' },
    { key: 'DSA', label: 'Algorithms (DSA)' },
    { key: 'C', label: 'C Programming' },
    { key: 'PYTHON', label: 'Python Programming' },
    { key: 'FULLSTACK', label: 'Full Stack Web' },
    { key: 'DATA_ANALYTICS', label: 'Data Analytics' },
    { key: 'DATA_SCIENCE', label: 'Data Science' },
    { key: 'SOFTWARE_TESTING', label: 'Software Testing' },
    { key: 'AUTOMATION_TESTING', label: 'Automation Testing' },
    { key: 'GIT_GITHUB', label: 'Git & GitHub' },
    { key: 'DEVOPS', label: 'DevOps & CI/CD' },
    { key: 'APTITUDE', label: 'Aptitude & Logic' },
    { key: 'AI_TOOLS', label: 'AI & AI Tools' },
    { key: 'NETWORKS', label: 'Computer Networks' },
    { key: 'OPERATING_SYSTEMS', label: 'Operating Systems' },
    { key: 'DBMS_CONCEPTS', label: 'DBMS Concepts' },
    { key: 'CS_FUNDAMENTALS', label: 'CS Fundamentals' },
    { key: 'SOFT_SKILLS', label: 'Soft Skills & HR' },
    { key: 'DEVELOPER_TOOLS', label: 'Tools & Env' }
  ];

  const startMockInterview = async () => {
    setLoading(true);
    setError('');
    setSelectedOption('');
    try {
      const payload = {
        type: interviewType,
        skills: selectedSkills,
        companyStyle: interviewType === 'COMPANY' ? companyStyle : ''
      };
      const response = await api.post('/api/mock-interview/start', payload);
      setInterviewId(response.data.mockInterviewId);
      setCurrentQuestion(response.data.firstQuestion);
      setCurrentRound(response.data.currentRound);
      setRoundName(response.data.roundName || 'Round 1');
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
        setRoundName(response.data.roundName || `Round ${response.data.currentRound}`);
        setQuestionIdx(response.data.questionIndex);
      }
    } catch (err) {
      setError('Failed to submit response.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && activeStep !== 1) return <Loading />;
  if (error) return <Error message={error} />;

  // 1. Lobby View
  if (activeStep === 0) {
    const handleSkillToggle = (key) => {
      if (interviewType === 'INDIVIDUAL') {
        setSelectedSkills([key]);
      } else {
        if (selectedSkills.includes(key)) {
          setSelectedSkills(selectedSkills.filter(s => s !== key));
        } else {
          setSelectedSkills([...selectedSkills, key]);
        }
      }
    };

    return (
      <div className="mock-lobby-wrapper">
        <div className="lobby-intro glass-panel">
          <Users className="lobby-intro-icon" />
          <h2>Custom Mock Interview Builder</h2>
          <p>
            Configure your technical interview assessment parameters. Select a preset type, customize target skills, or simulate industry-standard company interviews.
          </p>
        </div>

         <div className="mock-config-panel glass-panel">
          <h3>1. Choose Interview Type</h3>
          <div className="type-selector-grid">
            {[
              { type: 'TECHNICAL', title: 'Technical Only', desc: 'Core programming languages, DSA, and databases' },
              { type: 'NON_TECHNICAL', title: 'Non-Technical Only', desc: 'Quantitative aptitude, logical reasoning, and HR scenarios' },
              { type: 'PLACEMENT', title: 'Combined Placement', desc: 'Mixed technical rounds, aptitude, and soft skills' },
              { type: 'COMPANY', title: 'Company Presets', desc: 'Simulate Google, TCS, or Amazon interview patterns' },
              { type: 'INDIVIDUAL', title: 'Individual Track', desc: 'Targeted 4-round assessment on a single chosen skill' },
              { type: 'MULTIPLE', title: 'Custom Skills Mix', desc: 'Mix of multiple chosen technical skills' }
            ].map(item => (
              <button 
                key={item.type}
                onClick={() => {
                  setInterviewType(item.type);
                  setSelectedSkills([]);
                }}
                className={`type-option-btn glass-panel ${interviewType === item.type ? 'active' : ''}`}
              >
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </button>
            ))}
          </div>

          {interviewType === 'TECHNICAL' && (
            <div className="company-selector-section">
              <h3>2. Select Programming Language Focus (Optional)</h3>
              <div className="company-grid">
                {[
                  { key: '', label: 'General / Mixed Tech' },
                  { key: 'JAVA', label: 'Java Core Focus' },
                  { key: 'PYTHON', label: 'Python Focus' },
                  { key: 'C', label: 'C Programming Focus' }
                ].map(lang => (
                  <button
                    key={lang.key}
                    onClick={() => setSelectedSkills(lang.key ? [lang.key] : [])}
                    className={`company-option-btn glass-button ${
                      (lang.key === '' && selectedSkills.length === 0) ||
                      (lang.key !== '' && selectedSkills.includes(lang.key))
                        ? 'active' : ''
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {interviewType === 'COMPANY' && (
            <div className="company-selector-section">
              <h3>2. Select Target Company Presets</h3>
              <div className="company-grid">
                {['GOOGLE', 'TCS', 'AMAZON'].map(comp => (
                  <button
                    key={comp}
                    onClick={() => setCompanyStyle(comp)}
                    className={`company-option-btn glass-button ${companyStyle === comp ? 'active' : ''}`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(interviewType === 'INDIVIDUAL' || interviewType === 'MULTIPLE') && (
            <div className="skills-selector-section">
              <h3>2. Select Target Track(s)</h3>
              <div className="skills-selection-list">
                {allTracks.map(track => (
                  <button
                    key={track.key}
                    onClick={() => handleSkillToggle(track.key)}
                    className={`skill-pill-btn glass-button ${selectedSkills.includes(track.key) ? 'active' : ''}`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="lobby-actions" style={{ marginTop: '10px' }}>
            <button 
              onClick={startMockInterview} 
              disabled={
                (interviewType === 'INDIVIDUAL' && selectedSkills.length === 0) ||
                (interviewType === 'MULTIPLE' && selectedSkills.length === 0)
              }
              className="glass-button launch-mock-btn"
            >
              <Play size={18} />
              <span>Launch Mock Session</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Mock View
  if (activeStep === 1 && currentQuestion) {
    return (
      <div className="mock-active-wrapper">
        <div className="mock-round-indicator glass-panel">
          <h4>{roundName}</h4>
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

        <div className="scorecard-section glass-panel">
          <h3>Performance Breakdown</h3>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-meta">
                <span>{scorecard.round1Name || 'Round 1'}</span>
                <strong>{scorecard.javaScore} / 5 Correct</strong>
              </div>
              <div className="breakdown-bar-track"><div className="breakdown-bar-fill" style={{ width: `${(scorecard.javaScore/5)*100}%` }}></div></div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-meta">
                <span>{scorecard.round2Name || 'Round 2'}</span>
                <strong>{scorecard.sqlScore} / 5 Correct</strong>
              </div>
              <div className="breakdown-bar-track"><div className="breakdown-bar-fill" style={{ width: `${(scorecard.sqlScore/5)*100}%` }}></div></div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-meta">
                <span>{scorecard.round3Name || 'Round 3'}</span>
                <strong>{scorecard.dsaScore} / 5 Correct</strong>
              </div>
              <div className="breakdown-bar-track"><div className="breakdown-bar-fill" style={{ width: `${(scorecard.dsaScore/5)*100}%` }}></div></div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-meta">
                <span>{scorecard.round4Name || 'Round 4'}</span>
                <strong>{scorecard.techScore} / 5 Correct</strong>
              </div>
              <div className="breakdown-bar-track"><div className="breakdown-bar-fill" style={{ width: `${(scorecard.techScore/5)*100}%` }}></div></div>
            </div>
          </div>
        </div>

        <div className="scorecard-section feedback-summary glass-panel">
          <h3>Evaluation Feedback</h3>
          <p>{scorecard.feedbackSummary}</p>
        </div>

        <div className="scorecard-grid-bottom">
          <div className="scorecard-card glass-panel">
            <div className="card-header-with-icon">
              <CheckCircle className="card-icon green" style={{ color: '#10b981' }} />
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
              <AlertTriangle className="card-icon red" style={{ color: '#ef4444' }} />
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
