import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import Loading from '../components/Loading';
import { 
  Play, Save, RotateCcw, FileText, Share2, Terminal, Maximize, Minimize,
  CheckCircle2, XCircle, AlertCircle, History, Clock, Cpu, Code2, ListCollapse
} from 'lucide-react';
import './CodePilotIde.css';

const CodePilotIde = () => {
  // Questions list from Question Bank
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [code, setCode] = useState('');
  
  // Custom Input & Runner/Submit metrics
  const [customInput, setCustomInput] = useState('');
  const [terminalStdout, setTerminalStdout] = useState('');
  const [terminalStderr, setTerminalStderr] = useState('');
  const [terminalRunning, setTerminalRunning] = useState(false);
  const [statusText, setStatusText] = useState('Ready');
  const [executionTime, setExecutionTime] = useState('0 ms');
  const [memoryUsage, setMemoryUsage] = useState('0 MB');

  // Submit test case results
  const [submitResults, setSubmitResults] = useState(null);
  const [activeTab, setActiveTab] = useState('console'); // 'console', 'submissions'
  const [submissions, setSubmissions] = useState([]);

  // Fullscreen support
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load questions and submissions history
  useEffect(() => {
    fetchQuestions();
    fetchSubmissionHistory();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/api/questions');
      // Filter only coding-based types (CODING, SQL, WEB, CONFIGURATION)
      const filtered = res.data.filter(q => 
        ['CODING', 'SQL', 'WEB', 'CONFIGURATION'].includes(q.questionType?.toUpperCase())
      );
      setQuestions(filtered);
      
      // Select the first coding question by default if available
      if (filtered.length > 0) {
        handleSelectQuestion(filtered[0]);
      }
    } catch (err) {
      console.error('Error fetching question bank', err);
    }
  };

  const fetchSubmissionHistory = async () => {
    try {
      const res = await api.get('/api/submissions');
      setSubmissions(res.data);
    } catch (err) {
      console.error('Error fetching submissions history', err);
    }
  };

  const handleSelectQuestion = (q) => {
    setSelectedQuestion(q);
    
    // Automatically load template based on question category/language
    let initialLang = 'java';
    if (q.category?.toUpperCase() === 'SQL') {
      initialLang = 'sql';
    } else if (q.category?.toUpperCase() === 'FULLSTACK') {
      initialLang = 'javascript';
    } else if (q.category?.toUpperCase() === 'PYTHON') {
      initialLang = 'python';
    } else if (q.category?.toUpperCase() === 'C') {
      initialLang = 'c';
    }

    if (q.questionType?.toUpperCase() === 'WEB') {
      initialLang = 'html';
      setActiveTab('preview');
    } else {
      setActiveTab('console');
    }

    setSelectedLanguage(initialLang);
    setCode(getStarterTemplate(initialLang));
    setSubmitResults(null);
    setTerminalStdout('');
    setTerminalStderr('');
  };

  const getStarterTemplate = (lang) => {
    switch (lang) {
      case 'html':
        return `<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        body { background: #111; color: #fff; font-family: sans-serif; text-align: center; padding-top: 50px; }\n        h1 { color: #818cf8; }\n    </style>\n</head>\n<body>\n    <h1>CodePilot Live Compiler</h1>\n    <p>Write your markup and preview it here!</p>\n</body>\n</html>`;
      case 'java':
        return `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`;
      case 'c':
        return `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`;
      case 'cpp':
        return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`;
      case 'python':
        return `def main():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    main()`;
      case 'javascript':
        return `function main() {\n    // Write your solution here\n}\n\nmain();`;
      case 'typescript':
        return `function main(): void {\n    // Write your solution here\n}\n\nmain();`;
      case 'sql':
        return `-- Write your SQL query here\nSELECT * FROM employees;`;
      case 'php':
        return `<?php\n// Write your solution here\n?>`;
      case 'go':
        return `package main\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n}`;
      case 'csharp':
        return `using System;\n\nclass Program {\n    static void Main() {\n        // Write your solution here\n    }\n}`;
      case 'kotlin':
        return `fun main() {\n    // Write your solution here\n}`;
      case 'rust':
        return `fn main() {\n    // Write your solution here\n}`;
      default:
        return `// Write your solution here`;
    }
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(getStarterTemplate(lang));
  };

  const runCode = async () => {
    if (!selectedQuestion) return;
    try {
      setTerminalRunning(true);
      setStatusText('Running...');
      setTerminalStdout('');
      setTerminalStderr('');
      
      // Save temp file dynamically on the backend
      const path = getTargetFileName(selectedLanguage);
      await api.post('/api/workspace/files/save', {
        path: path,
        content: code
      });

      const params = new URLSearchParams();
      params.append('path', path);
      params.append('input', customInput);

      const res = await api.post(`/api/workspace/run?${params.toString()}`);
      setTerminalStdout(res.data.stdout || '');
      setTerminalStderr(res.data.stderr || '');
      setExecutionTime(res.data.executionTime || '0 ms');
      setMemoryUsage(res.data.memoryUsage || '0 MB');
      setStatusText(res.data.exitCode === 0 ? 'Success' : 'Failed');
    } catch (err) {
      setTerminalStderr('Runner Exception: ' + err.message);
      setStatusText('Error');
    } finally {
      setTerminalRunning(false);
    }
  };

  const submitCode = async () => {
    if (!selectedQuestion) return;
    try {
      setTerminalRunning(true);
      setStatusText('Submitting...');
      setTerminalStdout('');
      setTerminalStderr('');
      setSubmitResults(null);

      const path = getTargetFileName(selectedLanguage);
      await api.post('/api/workspace/files/save', {
        path: path,
        content: code
      });

      const params = new URLSearchParams();
      params.append('path', path);
      params.append('questionId', selectedQuestion.id);
      params.append('language', selectedLanguage);

      const res = await api.post(`/api/workspace/submit?${params.toString()}`);
      setSubmitResults(res.data);
      setExecutionTime(res.data.runtime || '0 ms');
      setMemoryUsage(res.data.memory || '0 MB');
      setStatusText(res.data.status);
      
      // Refresh submissions history list
      fetchSubmissionHistory();
    } catch (err) {
      setTerminalStderr('Submission Exception: ' + err.message);
      setStatusText('Error');
    } finally {
      setTerminalRunning(false);
    }
  };

  const getTargetFileName = (lang) => {
    switch (lang) {
      case 'java': return 'Main.java';
      case 'python': return 'main.py';
      case 'javascript': return 'index.js';
      case 'typescript': return 'index.ts';
      case 'c': return 'main.c';
      case 'cpp': return 'main.cpp';
      case 'sql': return 'query.sql';
      case 'php': return 'index.php';
      case 'go': return 'main.go';
      case 'csharp': return 'main.cs';
      case 'kotlin': return 'main.kt';
      default: return 'Main.java';
    }
  };

  const resetCode = () => {
    if (window.confirm('Reset code editor buffer? All unsaved modifications will be deleted.')) {
      setCode(getStarterTemplate(selectedLanguage));
    }
  };

  const shareCode = () => {
    const url = `${window.location.origin}/workspace?lang=${selectedLanguage}&code=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(url);
    alert('Workspace shareable URL copied to clipboard!');
  };

  const getEditorLanguage = (lang) => {
    switch (lang) {
      case 'html': return 'html';
      case 'java': return 'java';
      case 'python': return 'python';
      case 'javascript': return 'javascript';
      case 'typescript': return 'typescript';
      case 'c': return 'c';
      case 'cpp': return 'cpp';
      case 'sql': return 'sql';
      default: return 'text';
    }
  };

  return (
    <div className={`codecompiler-workspace ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* HEADER SECTION */}
      <header className="compiler-top-header">
        <div className="left-brand">
          <Code2 className="logo-icon text-indigo-400" />
          <span className="brand-logo">Coding Workspace</span>
        </div>

        <div className="middle-controls">
          <select className="language-selector-dropdown" value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="html">HTML</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="php">PHP</option>
            <option value="kotlin">Kotlin</option>
            <option value="csharp">C#</option>
          </select>

          <button className="run-action-btn" onClick={runCode} disabled={terminalRunning}>
            <Play size={14} className="play-icon" />
            Run
          </button>

          <button className="submit-action-btn" onClick={submitCode} disabled={terminalRunning}>
            Submit
          </button>

          <button className="action-button-compiler" onClick={resetCode} title="Reset editor buffer">
            <RotateCcw size={13} /> Reset
          </button>

          <button className="action-button-compiler" onClick={shareCode} title="Get workspace link">
            <Share2 size={13} /> Share
          </button>
        </div>

        <div className="right-toggles">
          <button className="action-button-compiler" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
          </button>
        </div>
      </header>

      {/* CORE SPLIT WORKSPACE PANELS */}
      <div className="compiler-main-content select-questions-layout">
        
        {/* LEFT PANEL: Problem Details */}
        <section className="left-code-editor-panel problem-detail-frame">
          <div className="panel-tab-headers flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="active-tab-file">Problem Details</span>
            </div>
            
            {/* Question Selector */}
            <select 
              className="question-selector-menu" 
              value={selectedQuestion ? selectedQuestion.id : ''} 
              onChange={(e) => {
                const q = questions.find(item => item.id === parseInt(e.target.value));
                if (q) handleSelectQuestion(q);
              }}
            >
              {questions.map((q, index) => (
                <option key={q.id} value={q.id}>
                  Problem #{String(index + 1).padStart(3, '0')}: {q.topicName}
                </option>
              ))}
            </select>
          </div>

          <div className="problem-description-content">
            {selectedQuestion ? (
              <div className="problem-body">
                <h3>{selectedQuestion.topicName}</h3>
                <span className={`difficulty-badge ${selectedQuestion.difficulty?.toLowerCase()}`}>
                  {selectedQuestion.difficulty}
                </span>

                <div className="description-section">
                  <h4>Description</h4>
                  <p className="description-text">{selectedQuestion.questionText}</p>
                </div>

                {selectedQuestion.explanation && (
                  <div className="description-section">
                    <h4>Examples & Constraints</h4>
                    <pre className="examples-block">{selectedQuestion.explanation}</pre>
                  </div>
                )}

                {selectedQuestion.questionType === 'SQL' && (
                  <div className="description-section border-t border-slate-800 pt-4 mt-4">
                    <span className="badge-sql">SQL Schema Attached</span>
                    <pre className="schema-display">
{`CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    salary INT,
    department VARCHAR(100)
);`}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-problem-placeholder">
                <AlertCircle className="text-slate-600 mb-2" size={32} />
                <p>No coding problems found. Add a CODING or SQL challenge to begin.</p>
              </div>
            )}
          </div>
        </section>

        {/* MIDDLE PANEL: Monaco Code Editor */}
        <section className="left-code-editor-panel">
          <div className="panel-tab-headers">
            <span className="active-tab-file">solution.{selectedLanguage}</span>
          </div>
          <div className="editor-screen-frame">
            <Editor
              height="100%"
              language={getEditorLanguage(selectedLanguage)}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 12 },
                quickSuggestions: false // No AI suggestions/autocomplete
              }}
            />
          </div>
        </section>

      </div>

      {/* BOTTOM LOGS & METRICS CONSOLE PANEL */}
      <footer className="compiler-bottom-console-split">
        
        {/* Input Panel */}
        <div className="input-cases-panel">
          <div className="console-headers flex items-center justify-between">
            <span>Input / Test Cases</span>
          </div>
          <textarea 
            className="cases-textarea"
            placeholder="Provide parameters to run custom test cases..."
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
          />
        </div>

        {/* Output Console Log tabs */}
        <div className="output-cases-panel">
          <div className="console-headers flex justify-between items-center">
            <div className="flex gap-4">
              <button 
                className={`console-tab-btn ${activeTab === 'console' ? 'active' : ''}`}
                onClick={() => setActiveTab('console')}
              >
                Console Output
              </button>
              <button 
                className={`console-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
                onClick={() => setActiveTab('submissions')}
              >
                Submission History
              </button>
              {selectedQuestion && selectedQuestion.questionType === 'WEB' && (
                <button 
                  className={`console-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  Web Preview
                </button>
              )}
            </div>
            
            <div className="execution-badges flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1"><Clock size={12} /> {executionTime}</span>
              <span className="flex items-center gap-1"><Cpu size={12} /> {memoryUsage}</span>
            </div>
          </div>

          <div className="console-outputs-body">
            {activeTab === 'preview' && (
              <div className="web-preview-container" style={{ height: '100%', background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                <iframe 
                  srcDoc={code}
                  title="Web Preview"
                  sandbox="allow-scripts"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            )}
            {activeTab === 'console' ? (
              <div className="console-terminal-view">
                {submitResults ? (
                  <div className="submit-grades-summary">
                    <h4 className={submitResults.status === 'Accepted' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {submitResults.status}
                    </h4>
                    <p className="text-slate-300 text-sm mt-1">
                      Passed: {submitResults.passedCases} / {submitResults.totalCases} test cases
                    </p>
                    <div className="testcase-rows-list mt-3 flex flex-col gap-2">
                      {Array.from({ length: submitResults.totalCases }).map((_, idx) => (
                        <div key={idx} className="testcase-run flex items-center justify-between bg-slate-900/60 p-2 rounded">
                          <span className="text-xs text-slate-400">Test Case {idx + 1}</span>
                          <span className={idx < submitResults.passedCases ? 'text-green-400 text-xs font-semibold' : 'text-red-400 text-xs font-semibold'}>
                            {idx < submitResults.passedCases ? '✓ Passed' : '✗ Failed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {terminalStdout && <pre className="output-stdout">{terminalStdout}</pre>}
                    {terminalStderr && <pre className="output-stderr">{terminalStderr}</pre>}
                    {!terminalStdout && !terminalStderr && <span className="empty-logs">Click Run or Submit to see execution logs...</span>}
                  </>
                )}
              </div>
            ) : (
              <div className="submissions-history-grid">
                {submissions.length === 0 ? (
                  <span className="empty-logs">No previous submissions found for this account.</span>
                ) : (
                  <table className="submissions-table">
                    <thead>
                      <tr>
                        <th>Problem</th>
                        <th>Lang</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Memory</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub, i) => (
                        <tr key={i}>
                          <td className="font-semibold text-slate-200">{sub.questionTitle}</td>
                          <td className="text-indigo-400">{sub.language}</td>
                          <td className={sub.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}>{sub.status}</td>
                          <td>{sub.runtime}</td>
                          <td>{sub.memory}</td>
                          <td className="text-slate-500 text-xs">{sub.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>

      </footer>

      {/* FOOTER STATUS */}
      <footer className="compiler-status-bar">
        <div className="status-segment">
          <span className="dot"></span>
          <span>Status: <strong>{statusText}</strong></span>
        </div>
      </footer>
    </div>
  );
};

export default CodePilotIde;
