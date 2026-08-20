import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { 
  Folder, File, Play, Save, Trash2, Plus, FolderPlus, 
  Sparkles, Code, ShieldAlert, Cpu, CheckSquare, RefreshCw, 
  Send, Bot, User, FileText, ChevronRight, Terminal, 
  ExternalLink, HelpCircle, Layers, X, Share2, RotateCcw, Maximize, Minimize 
} from 'lucide-react';
import './CodePilotIde.css';

const CodePilotIde = () => {
  // File & Explorer State
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [code, setCode] = useState('');
  const [explorerLoading, setExplorerLoading] = useState(true);
  const [newFileName, setNewFileName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(null); // 'FILE' or 'DIRECTORY'
  const [selectedLanguage, setSelectedLanguage] = useState('java');

  // Input & Output states
  const [customInput, setCustomInput] = useState('');
  const [terminalStdout, setTerminalStdout] = useState('');
  const [terminalStderr, setTerminalStderr] = useState('');
  const [terminalExitCode, setTerminalExitCode] = useState(null);
  const [terminalRunning, setTerminalRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState('0 ms');
  const [memoryUsage, setMemoryUsage] = useState('0 MB');
  const [statusText, setStatusText] = useState('Ready');

  // Layout states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // AI Assistant Right Drawer State
  const [aiTab, setAiTab] = useState('chat'); // 'chat', 'review', 'fix'
  const [aiChatQuery, setAiChatQuery] = useState('');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiResponse, setAiResponse] = useState(null);

  // Load files on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async (langToSelect = 'java') => {
    try {
      setExplorerLoading(true);
      const res = await api.get('/api/workspace/files');
      setFiles(res.data);
      
      // Auto resolve active file corresponding to language selected
      const targetFileName = getTargetFileName(langToSelect);
      const matchedFile = res.data.find(f => f.name.toLowerCase() === targetFileName.toLowerCase());
      
      if (matchedFile) {
        loadFile(matchedFile);
      } else {
        // Create file if it doesn't exist
        await api.post(`/api/workspace/files/create?path=${targetFileName}&type=FILE`);
        // Save standard starter template
        await api.post('/api/workspace/files/save', {
          path: targetFileName,
          content: getStarterTemplate(langToSelect)
        });
        const refreshRes = await api.get('/api/workspace/files');
        setFiles(refreshRes.data);
        const createdFile = refreshRes.data.find(f => f.name.toLowerCase() === targetFileName.toLowerCase());
        if (createdFile) loadFile(createdFile);
      }
    } catch (err) {
      console.error('Error fetching files', err);
    } finally {
      setExplorerLoading(false);
    }
  };

  const getTargetFileName = (lang) => {
    switch (lang) {
      case 'java': return 'Main.java';
      case 'python': return 'main.py';
      case 'javascript': return 'index.js';
      case 'c': return 'main.c';
      case 'cpp': return 'main.cpp';
      case 'php': return 'main.php';
      case 'go': return 'main.go';
      case 'csharp': return 'main.cs';
      case 'kotlin': return 'main.kt';
      default: return 'Main.java';
    }
  };

  const getStarterTemplate = (lang) => {
    switch (lang) {
      case 'java':
        return `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java Compiler!");\n    }\n}`;
      case 'python':
        return `print("Hello from Python Compiler!")`;
      case 'javascript':
        return `console.log("Hello from JavaScript Compiler!");`;
      case 'c':
        return `#include <stdio.h>\n\nint main() {\n    printf("Hello from C Compiler!\\n");\n    return 0;\n}`;
      case 'cpp':
        return `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from C++ Compiler!" << endl;\n    return 0;\n}`;
      case 'php':
        return `<?php\necho "Hello from PHP Compiler!\\n";\n?>`;
      case 'go':
        return `package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go Compiler!")\n}`;
      case 'csharp':
        return `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from C# Compiler!");\n    }\n}`;
      case 'kotlin':
        return `fun main() {\n    println("Hello from Kotlin Compiler!")\n}`;
      default:
        return '';
    }
  };

  const loadFile = async (file) => {
    try {
      const res = await api.get(`/api/workspace/files/content?path=${file.path}`);
      setActiveFile(res.data);
      setCode(res.data.content || '');
      
      // Update selected language dropdown based on active file loaded
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      const resolvedLang = getLanguageFromExt(ext);
      setSelectedLanguage(resolvedLang);
      
      // Add to tabs if not present
      if (!openTabs.find(t => t.path === file.path)) {
        setOpenTabs(prev => [...prev, file]);
      }
    } catch (err) {
      console.error('Error loading file content', err);
    }
  };

  const getLanguageFromExt = (ext) => {
    switch (ext) {
      case '.java': return 'java';
      case '.py': return 'python';
      case '.js': return 'javascript';
      case '.c': return 'c';
      case '.cpp': return 'cpp';
      case '.php': return 'php';
      case '.go': return 'go';
      case '.cs': return 'csharp';
      case '.kt': return 'kotlin';
      default: return 'java';
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    fetchFiles(newLang);
  };

  const saveActiveFile = async () => {
    if (!activeFile) return;
    try {
      setStatusText('Saving...');
      await api.post('/api/workspace/files/save', {
        path: activeFile.path,
        content: code
      });
      setStatusText('Saved successfully');
      setTimeout(() => setStatusText('Ready'), 2000);
    } catch (err) {
      setStatusText('Error saving file');
    }
  };

  const runActiveCode = async () => {
    if (!activeFile) return;
    try {
      setTerminalRunning(true);
      setStatusText('Compiling & Running...');
      setTerminalStdout('');
      setTerminalStderr('');
      setTerminalExitCode(null);
      
      // Save changes first
      await api.post('/api/workspace/files/save', {
        path: activeFile.path,
        content: code
      });

      // Pass path and custom input parameters
      const params = new URLSearchParams();
      params.append('path', activeFile.path);
      params.append('input', customInput);

      const res = await api.post(`/api/workspace/run?${params.toString()}`);
      setTerminalStdout(res.data.stdout || '');
      setTerminalStderr(res.data.stderr || '');
      setTerminalExitCode(res.data.exitCode);
      setExecutionTime(res.data.executionTime || '0 ms');
      setMemoryUsage(res.data.memoryUsage || '0 MB');
      
      if (res.data.exitCode === 0) {
        setStatusText('Execution completed');
      } else {
        setStatusText('Execution failed');
      }
    } catch (err) {
      setTerminalStderr('Runner exception: ' + err.message);
      setTerminalExitCode(-1);
      setStatusText('Error');
    } finally {
      setTerminalRunning(false);
      setTimeout(() => setStatusText('Ready'), 3000);
    }
  };

  const resetCode = () => {
    if (window.confirm('Reset code to starter template? Your current changes will be overwritten.')) {
      setCode(getStarterTemplate(selectedLanguage));
    }
  };

  const downloadCode = () => {
    if (!activeFile) return;
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = activeFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shareCode = () => {
    const shareUrl = `${window.location.origin}/workspace?lang=${selectedLanguage}&code=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Shareable compiler workspace link copied to clipboard!');
  };

  const createNewItem = async (type) => {
    if (!newFileName.trim()) return;
    try {
      await api.post(`/api/workspace/files/create?path=${newFileName}&type=${type}`);
      setNewFileName('');
      setShowCreateInput(null);
      fetchFiles(selectedLanguage);
    } catch (err) {
      alert('Failed to create item. Name conflict or directory invalid.');
    }
  };

  const deleteItem = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;
    try {
      await api.delete(`/api/workspace/files/delete?path=${file.path}`);
      setOpenTabs(prev => prev.filter(t => t.path !== file.path));
      if (activeFile && activeFile.path === file.path) {
        setActiveFile(null);
        setCode('');
      }
      fetchFiles(selectedLanguage);
    } catch (err) {
      alert('Error deleting item');
    }
  };

  // AI Actions Trigger
  const triggerAiAction = async (actionType, extraText = '', targetLang = '') => {
    if (!activeFile) return;
    try {
      setAiLoading(true);
      setAiError('');
      setShowAiDrawer(true);
      
      if (actionType === 'REVIEW') {
        setAiTab('review');
      } else if (actionType === 'BUG_DETECT' || actionType === 'OPTIMIZE' || actionType === 'REFACTOR') {
        setAiTab('fix');
      } else {
        setAiTab('chat');
      }

      const payload = {
        action: actionType,
        code: code,
        language: getEditorLanguage(activeFile.name),
        extraPrompt: extraText,
        fileName: activeFile.name,
        targetLanguage: targetLang
      };

      const res = await api.post('/api/workspace/ai/action', payload);
      setAiResponse(res.data);

      if (actionType === 'CHAT' || actionType === 'GENERATE' || actionType === 'EXPLAIN' || actionType === 'SQL_ASSIST' || actionType === 'LEARNING' || actionType === 'GIT' || actionType === 'DEVOPS' || actionType === 'DEPENDENCY' || actionType === 'CONVERT') {
        const aiMessage = {
          sender: 'AI',
          text: res.data.explanation || res.data.generatedCode || 'Fulfillment executed successfully.',
          generatedCode: res.data.generatedCode,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAiMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      setAiError('AI Copilot request failed.');
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendChat = () => {
    if (!aiChatQuery.trim()) return;
    const userMsg = {
      sender: 'USER',
      text: aiChatQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAiMessages(prev => [...prev, userMsg]);
    triggerAiAction('CHAT', aiChatQuery);
    setAiChatQuery('');
  };

  const applyCorrectedCode = () => {
    if (aiResponse && aiResponse.correctedCode) {
      setCode(aiResponse.correctedCode);
      setStatusText('AI fix applied');
      setTimeout(() => setStatusText('Ready'), 2000);
    }
  };

  const getEditorLanguage = (fileName) => {
    if (!fileName) return 'text';
    const ext = fileName.substring(fileName.lastIndexOf('.'));
    switch (ext) {
      case '.java': return 'java';
      case '.py': return 'python';
      case '.js': return 'javascript';
      case '.ts': return 'typescript';
      case '.c': return 'c';
      case '.cpp': return 'cpp';
      case '.php': return 'php';
      case '.go': return 'go';
      case '.cs': return 'csharp';
      case '.kt': return 'kotlin';
      case '.sql': return 'sql';
      case '.html': return 'html';
      case '.css': return 'css';
      default: return 'text';
    }
  };

  return (
    <div className={`codecompiler-workspace ${isFullscreen ? 'fullscreen-mode' : ''} ${showAiDrawer ? 'ai-drawer-open' : ''}`}>
      {/* 1. TOP HEADER BAR */}
      <header className="compiler-top-header">
        <div className="left-brand">
          <Terminal className="logo-icon" />
          <span className="brand-logo">CodeCompiler</span>
        </div>

        <div className="middle-controls">
          <select className="language-selector-dropdown" value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="php">PHP</option>
            <option value="go">Go</option>
            <option value="csharp">C#</option>
            <option value="kotlin">Kotlin</option>
          </select>

          <button className="run-action-btn" onClick={runActiveCode} disabled={terminalRunning || !activeFile}>
            <Play size={14} className="play-icon" />
            {terminalRunning ? 'Running...' : 'Run Code'}
          </button>
          
          <button className="action-button-compiler" onClick={saveActiveFile} title="Save file to cloud">
            <Save size={13} /> Save
          </button>

          <button className="action-button-compiler" onClick={shareCode} title="Get shareable link">
            <Share2 size={13} /> Share
          </button>

          <button className="action-button-compiler" onClick={resetCode} title="Reset code template">
            <RotateCcw size={13} /> Reset
          </button>

          <button className="action-button-compiler" onClick={downloadCode} title="Download file to computer">
            <FileText size={13} /> Download
          </button>
        </div>

        <div className="right-toggles">
          <button className="ai-assistant-toggle-btn" onClick={() => setShowAiDrawer(!showAiDrawer)}>
            <Sparkles size={14} style={{ marginRight: '6px' }} />
            AI Copilot
          </button>
          <button className="action-button-compiler" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
          </button>
        </div>
      </header>

      {/* 2. MAIN SPLIT EDITOR CONTENT AREA */}
      <div className="compiler-main-content">
        
        {/* LEFT COMPILER BLOCK: Code Editor */}
        <section className="left-code-editor-panel">
          <div className="panel-tab-headers">
            <span className="active-tab-file">
              <Code size={13} style={{ marginRight: '6px' }} />
              {activeFile ? activeFile.name : 'Editor'}
            </span>
          </div>

          <div className="editor-screen-frame">
            {activeFile ? (
              <Editor
                height="100%"
                language={getEditorLanguage(activeFile.name)}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val)}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 12 },
                  autoSave: true
                }}
              />
            ) : (
              <div className="no-editor-placeholder">
                <Code size={36} className="muted-icon" />
                <p>Initializing compiler workspace...</p>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COMPILER BLOCK: Input & Output / Console */}
        <section className="right-input-output-panel">
          
          {/* Top Half: Input Panel */}
          <div className="compiler-input-panel">
            <div className="panel-header-bar">
              <span>CUSTOM INPUT (stdin)</span>
            </div>
            <textarea 
              className="input-textarea"
              placeholder="Enter parameters or values here to pass to program inputs..."
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
            />
          </div>

          {/* Bottom Half: Output / Console */}
          <div className="compiler-output-panel">
            <div className="panel-header-bar">
              <span>OUTPUT / CONSOLE</span>
              {terminalStdout || terminalStderr ? (
                <button className="clear-console-btn" onClick={() => { setTerminalStdout(''); setTerminalStderr(''); }}>Clear</button>
              ) : null}
            </div>
            <div className="output-console-body">
              {terminalStdout && <pre className="output-stdout">{terminalStdout}</pre>}
              {terminalStderr && <pre className="output-stderr">{terminalStderr}</pre>}
              {!terminalStdout && !terminalStderr && <span className="empty-logs">Execution logs will print here...</span>}
            </div>
          </div>

        </section>

        {/* 3. COLLAPSIBLE RIGHT AI ASSISTANT DRAWER */}
        {showAiDrawer && (
          <aside className="ai-assistant-drawer glass-panel">
            <div className="drawer-tabs-row">
              <button className={`tab-btn ${aiTab === 'chat' ? 'active' : ''}`} onClick={() => setAiTab('chat')}>CHAT</button>
              <button className={`tab-btn ${aiTab === 'review' ? 'active' : ''}`} onClick={() => setAiTab('review')}>REVIEW</button>
              <button className={`tab-btn ${aiTab === 'fix' ? 'active' : ''}`} onClick={() => setAiTab('fix')}>AUTOFIX</button>
              <button className="close-drawer-btn" onClick={() => setShowAiDrawer(false)}><X size={14} /></button>
            </div>

            <div className="drawer-actions-toolbar">
              <button className="ai-pill" onClick={() => triggerAiAction('EXPLAIN')}>Explain</button>
              <button className="ai-pill" onClick={() => triggerAiAction('BUG_DETECT')}>Bugs</button>
              <button className="ai-pill" onClick={() => triggerAiAction('REFACTOR')}>Refactor</button>
              <button className="ai-pill" onClick={() => triggerAiAction('OPTIMIZE')}>Optimize</button>
              <button className="ai-pill" onClick={() => triggerAiAction('TEST_GEN')}>Tests</button>
            </div>

            <div className="drawer-viewport">
              {aiTab === 'chat' && (
                <div className="chat-tab-container">
                  <div className="chat-messages-scroll">
                    {aiMessages.length === 0 ? (
                      <div className="empty-help">
                        <Bot size={24} className="pulsing-logo" />
                        <p>Ask CodePilot to generate, refactor, or explain this workspace code!</p>
                      </div>
                    ) : (
                      aiMessages.map((msg, i) => (
                        <div key={i} className={`msg-block ${msg.sender.toLowerCase()}`}>
                          <div className="msg-text">{msg.text}</div>
                        </div>
                      ))
                    )}
                    {aiLoading && <div className="msg-block ai typing">AI is typing...</div>}
                  </div>
                  <div className="chat-bar-box">
                    <input 
                      type="text" 
                      placeholder="Ask AI compiler assistant..." 
                      value={aiChatQuery}
                      onChange={e => setAiChatQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    />
                    <button onClick={handleSendChat}><Send size={14} /></button>
                  </div>
                </div>
              )}

              {aiTab === 'review' && (
                <div className="review-tab-container">
                  <h4>Vulnerability Checklist:</h4>
                  {aiLoading ? (
                    <Loading />
                  ) : aiResponse && aiResponse.reviewItems ? (
                    <div className="review-cards-list">
                      {aiResponse.reviewItems.map((item, idx) => (
                        <div key={idx} className="review-card-alert">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="placeholder-text">Click the Review AI pills to run checklist checks.</p>
                  )}
                </div>
              )}

              {aiTab === 'fix' && (
                <div className="fix-tab-container">
                  {aiLoading ? (
                    <Loading />
                  ) : aiResponse && aiResponse.correctedCode ? (
                    <div className="autofix-preview-box">
                      <h5>Complexity: {aiResponse.originalComplexity || 'N/A'} → {aiResponse.improvedComplexity || 'N/A'}</h5>
                      <pre className="corrected-code-snippet">{aiResponse.correctedCode}</pre>
                      <button className="glass-button success apply-btn" onClick={applyCorrectedCode}>
                        Apply Corrections
                      </button>
                    </div>
                  ) : (
                    <p className="placeholder-text">Click optimized/bug fixes actions to view autofix diagnostics.</p>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}

      </div>

      {/* 4. FOOTER STATUS BAR */}
      <footer className="compiler-status-bar">
        <div className="status-segment">
          <span className="dot"></span>
          <span>Status: <strong>{statusText}</strong></span>
        </div>
        <div className="status-segment border-left">
          <span>Execution Time: <strong>{executionTime}</strong></span>
        </div>
        <div className="status-segment border-left">
          <span>Memory Usage: <strong>{memoryUsage}</strong></span>
        </div>
      </footer>
    </div>
  );
};

export default CodePilotIde;
