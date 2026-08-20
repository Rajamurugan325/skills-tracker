import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import ScoreCard from '../components/ScoreCard';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { ClipboardCheck, Play, ArrowLeft, ArrowRight, CheckCircle, Code2 } from 'lucide-react';
import './Quiz.css';

const Quiz = () => {
  const [lobbyCategory, setLobbyCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [activeStep, setActiveStep] = useState(0); // 0: Lobby, 1: Quiz Active, 2: Scorecard
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> selectedOption
  const [results, setResults] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startQuiz = async (category) => {
    setLoading(true);
    setError('');
    setAnswers({});
    setCurrentIdx(0);
    try {
      const response = await api.post('/api/quiz/start', { category });
      setAttemptId(response.data.attemptId);
      setQuestions(response.data.questions);
      setActiveStep(1);
    } catch (err) {
      setError('Failed to start the adaptive quiz session.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    const activeQ = questions[currentIdx];
    setAnswers({
      ...answers,
      [activeQ.id]: option
    });
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setError('');
    
    // Map answer states to DTO requirements
    const answerPayloads = Object.keys(answers).map(qId => ({
      questionId: parseInt(qId),
      selectedAnswer: answers[qId]
    }));

    try {
      const response = await api.post('/api/quiz/submit', {
        attemptId: attemptId,
        answers: answerPayloads
      });
      setResults(response.data);
      setActiveStep(2);
    } catch (err) {
      setError('Failed to submit your quiz responses.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  // 1. Lobby View
  if (activeStep === 0) {
    return (
      <div className="quiz-lobby-wrapper">
        <div className="lobby-header glass-panel">
          <ClipboardCheck className="lobby-icon" />
          <h2>Adaptive Skill Quiz</h2>
          <p>
            This 10-question evaluation determines your technical proficiency. Answering correctly 
            escalates question difficulty, whereas incorrect responses shift difficulty down.
          </p>
        </div>

        <div className="lobby-categories">
          <h3>Choose Practice Track:</h3>
          <div className="category-selection-grid">
            <button onClick={() => startQuiz('JAVA')} className="category-card glass-panel">
              <span className="code-lang">Java Core</span>
              <p>Basics, OOPs, Collections, Exceptions, Lambdas</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>
            
            <button onClick={() => startQuiz('SQL')} className="category-card glass-panel">
              <span className="code-lang">SQL Database</span>
              <p>Joins, SELECTs, GROUP BYs, Subqueries, ACID</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>
            
            <button onClick={() => startQuiz('DSA')} className="category-card glass-panel">
              <span className="code-lang">Algorithms (DSA)</span>
              <p>Arrays, Sorting, Binary Search, Stacks, Trees, Graphs</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('C')} className="category-card glass-panel">
              <span className="code-lang">C Programming</span>
              <p>Basics, Functions, Pointers, Structs, Memory Allocation</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('PYTHON')} className="category-card glass-panel">
              <span className="code-lang">Python Programming</span>
              <p>Syntax, Lists, Tuples, OOPs, Decorators, Generators</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('FULLSTACK')} className="category-card glass-panel">
              <span className="code-lang">Full Stack Web</span>
              <p>HTML, CSS, React, Express, REST APIs, Databases</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('DATA_ANALYTICS')} className="category-card glass-panel">
              <span className="code-lang">Data Analytics</span>
              <p>Excel, Power Query/Pivot, DAX, Visualization, Statistics, Power BI</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('DATA_SCIENCE')} className="category-card glass-panel">
              <span className="code-lang">Data Science</span>
              <p>NumPy, Pandas, EDA, Feature Engineering, Machine Learning</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('SOFTWARE_TESTING')} className="category-card glass-panel">
              <span className="code-lang">Software Testing</span>
              <p>Manual Testing, SDLC/STLC, Test Cases, Bug Reporting, API Testing</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('AUTOMATION_TESTING')} className="category-card glass-panel">
              <span className="code-lang">Automation Testing</span>
              <p>Selenium WebDriver, Java, TestNG, Frameworks, POM, XPath/CSS</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('GIT_GITHUB')} className="category-card glass-panel">
              <span className="code-lang">Git & GitHub</span>
              <p>Repository Management, Branching/Merging, Pull Requests, Actions</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('DEVOPS')} className="category-card glass-panel">
              <span className="code-lang">DevOps & CI/CD</span>
              <p>Jenkins Pipelines, Maven, Webhooks, Docker, CI/CD Workflows</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('APTITUDE')} className="category-card glass-panel">
              <span className="code-lang">Aptitude & Logic</span>
              <p>Quantitative Aptitude, Logical Reasoning, Verbal Ability, Probability</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('AI_TOOLS')} className="category-card glass-panel">
              <span className="code-lang">AI & AI Tools</span>
              <p>Generative AI, Prompt Engineering, Coding Assistants, Automation</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('NETWORKS')} className="category-card glass-panel">
              <span className="code-lang">Computer Networks</span>
              <p>OSI & TCP/IP Models, IP Addressing, DNS, HTTP/HTTPS, Routing</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('OPERATING_SYSTEMS')} className="category-card glass-panel">
              <span className="code-lang">Operating Systems</span>
              <p>Processes, Threads, CPU Scheduling, Deadlocks, Memory Management</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('DBMS_CONCEPTS')} className="category-card glass-panel">
              <span className="code-lang">DBMS Concepts</span>
              <p>ER Model, Normalization, ACID, Indexing, Concurrency, Triggers</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('CS_FUNDAMENTALS')} className="category-card glass-panel">
              <span className="code-lang">CS Fundamentals</span>
              <p>OOPs, Compiler vs Interpreter, Software Eng, System Design</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('SOFT_SKILLS')} className="category-card glass-panel">
              <span className="code-lang">Soft Skills & HR</span>
              <p>HR Questions, Communication, Teamwork, Behavioral Scenarios</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>

            <button onClick={() => startQuiz('DEVELOPER_TOOLS')} className="category-card glass-panel">
              <span className="code-lang">Tools & Env</span>
              <p>VS Code, Postman, Docker, Git, Chrome DevTools, IntelliJ, Maven</p>
              <span className="go-btn"><Play size={14} /> Start</span>
            </button>
          </div>

          <div className="or-divider">OR</div>

          <button onClick={() => startQuiz('')} className="adaptive-main-btn glass-button">
            Launch Mixed Adaptive Assessment
          </button>
        </div>
      </div>
    );
  }

  // 2. Active Test View
  if (activeStep === 1) {
    const activeQ = questions[currentIdx];
    const isLast = currentIdx === questions.length - 1;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="quiz-active-wrapper">
        <ProgressBar current={currentIdx + 1} total={questions.length} />

        <QuestionCard
          question={activeQ}
          selectedOption={answers[activeQ.id] || ''}
          onOptionSelect={handleOptionSelect}
        />

        {activeQ.questionType && ['CODING', 'SQL', 'WEB', 'CONFIGURATION'].includes(activeQ.questionType.toUpperCase()) && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <Link to={`/workspace?questionId=${activeQ.id}`} target="_blank" className="glass-button success flex items-center gap-2" style={{ textDecoration: 'none' }}>
              <Code2 size={16} style={{ marginRight: '6px' }} />
              Open in Coding Workspace
            </Link>
          </div>
        )}

        <div className="quiz-navigation">
          <button
            onClick={prevQuestion}
            disabled={currentIdx === 0}
            className="glass-button secondary"
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          {isLast ? (
            <button
              onClick={submitQuiz}
              disabled={answeredCount < questions.length}
              className="glass-button submit-quiz-btn"
            >
              <span>Submit Assessment</span>
              <CheckCircle size={16} />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="glass-button"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. Results / Scorecard View
  if (activeStep === 2 && results) {
    return (
      <div className="quiz-result-wrapper">
        <ScoreCard
          score={results.score}
          total={results.totalQuestions}
          title="Adaptive Quiz Results"
          category={lobbyCategory || 'Mixed Practice'}
        />

        <div className="solutions-section">
          <h3>Question Explanations</h3>
          <div className="solutions-list">
            {results.answers.map((ans, idx) => (
              <div key={idx} className={`solution-item glass-panel ${ans.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="solution-head">
                  <span className="q-number">Q{idx + 1}.</span>
                  <span className={`status-tag ${ans.isCorrect ? 'ok' : 'err'}`}>
                    {ans.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="q-text">{ans.questionText}</p>
                <div className="q-answers-details">
                  <p>Your Answer: <span>{ans.selectedAnswer || 'Not answered'}</span></p>
                  <p>Correct Answer: <span className="correct-highlight">{ans.correctAnswer}</span></p>
                </div>
                <div className="q-explanation">
                  <h5>Explanation:</h5>
                  <p>{ans.explanation}</p>
                </div>
              </div>
            ))}
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

export default Quiz;
