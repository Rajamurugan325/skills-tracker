import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { 
  Folder, File, Play, Save, Trash2, Plus, FolderPlus, 
  Sparkles, Code, ShieldAlert, Cpu, CheckSquare, RefreshCw, 
  Send, Bot, User, FileText, ChevronRight, CornerDownRight, 
  GitBranch, Terminal, ExternalLink, HelpCircle, Layers, X
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
  const [codeSearch, setCodeSearch] = useState('');
  const fileInputRef = useRef(null);

  // Terminal state
  const [terminalStdout, setTerminalStdout] = useState('');
  const [terminalStderr, setTerminalStderr] = useState('');
  const [terminalExitCode, setTerminalExitCode] = useState(null);
  const [terminalRunning, setTerminalRunning] = useState(false);

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

  const fetchFiles = async () => {
    try {
      setExplorerLoading(true);
      const res = await api.get('/api/workspace/files');
      setFiles(res.data);
      if (res.data.length > 0 && !activeFile) {
        // Load first file by default
        const firstFile = res.data.find(f => f.type === 'FILE');
        if (firstFile) {
          loadFile(firstFile);
        }
      }
    } catch (err) {
      console.error('Error fetching files', err);
    } finally {
      setExplorerLoading(false);
    }
  };

  const loadFile = async (file) => {
    try {
      const res = await api.get(`/api/workspace/files/content?path=${file.path}`);
      setActiveFile(res.data);
      setCode(res.data.content || '');
      
      // Add to tabs if not present
      if (!openTabs.find(t => t.path === file.path)) {
        setOpenTabs(prev => [...prev, file]);
      }
    } catch (err) {
      console.error('Error loading file content', err);
    }
  };

  const saveActiveFile = async () => {
    if (!activeFile) return;
    try {
      await api.post('/api/workspace/files/save', {
        path: activeFile.path,
        content: code
      });
      // Show terminal alert
      setTerminalStdout(prev => prev + `[System] Saved ${activeFile.name} successfully.\n`);
    } catch (err) {
      setTerminalStderr(prev => prev + `[System Error] Failed to save file.\n`);
    }
  };

  const runActiveCode = async () => {
    if (!activeFile) return;
    try {
      setTerminalRunning(true);
      setTerminalStdout('');
      setTerminalStderr('');
      setTerminalExitCode(null);
      
      // Save changes first
      await api.post('/api/workspace/files/save', {
        path: activeFile.path,
        content: code
      });

      const res = await api.post(`/api/workspace/run?path=${activeFile.path}`);
      setTerminalStdout(res.data.stdout || '');
      setTerminalStderr(res.data.stderr || '');
      setTerminalExitCode(res.data.exitCode);
    } catch (err) {
      setTerminalStderr('Runner exception: ' + err.message);
      setTerminalExitCode(-1);
    } finally {
      setTerminalRunning(false);
    }
  };

  const createNewItem = async (type) => {
    if (!newFileName.trim()) return;
    try {
      await api.post(`/api/workspace/files/create?path=${newFileName}&type=${type}`);
      setNewFileName('');
      setShowCreateInput(null);
      fetchFiles();
    } catch (err) {
      alert('Failed to create item. Name conflict or directory invalid.');
    }
  };

  const deleteItem = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;
    try {
      await api.delete(`/api/workspace/files/delete?path=${file.path}`);
      // Remove from tabs and clear active file if it was deleted
      setOpenTabs(prev => prev.filter(t => t.path !== file.path));
      if (activeFile && activeFile.path === file.path) {
        setActiveFile(null);
        setCode('');
      }
      fetchFiles();
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
      
      // Set correct tab depending on action
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

      // Append message if using Chat/Interactive actions
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
      setAiError('AI Copilot request failed. Please check backend logs.');
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
      setTerminalStdout(prev => prev + '[AI Copilot] Applied automated corrections into the active editor.\n');
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
      case '.html': return 'html';
      case '.css': return 'css';
      case '.sql': return 'sql';
      case '.cpp':
      case '.cc': return 'cpp';
      case '.c': return 'c';
      default: return 'text';
    }
  };

  const closeTab = (tabPath) => {
    const remaining = openTabs.filter(t => t.path !== tabPath);
    setOpenTabs(remaining);
    if (activeFile && activeFile.path === tabPath) {
      if (remaining.length > 0) {
        loadFile(remaining[remaining.length - 1]);
      } else {
        setActiveFile(null);
        setCode('');
      }
    }
  };

  return (
    <div className="codepilot-ide-layout">
      {/* 1. LEFT PANEL: Workspace Explorer & Search */}
      <aside className="ide-left-panel glass-panel">
        <div className="panel-header">
          <h3>WORKSPACE EXPLORER</h3>
          <div className="explorer-actions">
            <button onClick={() => setShowCreateInput(showCreateInput === 'FILE' ? null : 'FILE')} title="New File">
              <Plus size={16} />
            </button>
            <button onClick={() => setShowCreateInput(showCreateInput === 'DIRECTORY' ? null : 'DIRECTORY')} title="New Folder">
              <FolderPlus size={16} />
            </button>
            <button onClick={fetchFiles} title="Refresh Workspace">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {showCreateInput && (
          <div className="create-item-form">
            <input 
              type="text" 
              placeholder={`Create ${showCreateInput.toLowerCase()}... (e.g. Test.java)`} 
              value={newFileName} 
              onChange={(e) => setNewFileName(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && createNewItem(showCreateInput)}
            />
            <div className="form-buttons">
              <button className="glass-button success" onClick={() => createNewItem(showCreateInput)}>Create</button>
              <button className="glass-button danger" onClick={() => setShowCreateInput(null)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="file-tree-container">
          {explorerLoading ? (
            <Loading />
          ) : (
            <div className="file-list">
              {files.map((file, i) => (
                <div 
                  key={i} 
                  className={`file-item ${activeFile?.path === file.path ? 'active' : ''}`}
                >
                  <div className="file-item-click" onClick={() => loadFile(file)}>
                    {file.type === 'DIRECTORY' ? (
                      <Folder size={15} style={{ color: '#fbbf24', marginRight: '6px' }} />
                    ) : (
                      <File size={15} style={{ color: '#94a3b8', marginRight: '6px' }} />
                    )}
                    <span className="file-name">{file.name}</span>
                  </div>
                  <button className="delete-file-btn" onClick={() => deleteItem(file)} title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workspace Codebase Search */}
        <div className="workspace-search-panel">
          <h4>Search Codebase</h4>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="e.g. Find Database Connection..." 
              value={codeSearch} 
              onChange={(e) => setCodeSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && triggerAiAction('CHAT', `Find where this concept is in the files: ${codeSearch}`)}
            />
            <button onClick={() => triggerAiAction('CHAT', `Find where this concept is in the files: ${codeSearch}`)}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. CENTER PANEL: Editor, Quick AI Toolbar & Output Terminal */}
      <main className="ide-center-panel">
        {/* File Tabs */}
        <div className="editor-tabs-bar">
          {openTabs.map((tab, idx) => (
            <div 
              key={idx} 
              className={`editor-tab-item ${activeFile?.path === tab.path ? 'active' : ''}`}
              onClick={() => loadFile(tab)}
            >
              <span>{tab.name}</span>
              <button className="close-tab-btn" onClick={(e) => { e.stopPropagation(); closeTab(tab.path); }}>
                <X size={10} />
              </button>
            </div>
          ))}
        </div>

        {/* Editor Controls */}
        <div className="editor-controls-bar">
          <div className="left-controls">
            <button className="glass-button primary run-btn" onClick={runActiveCode} disabled={terminalRunning || !activeFile}>
              <Play size={14} style={{ marginRight: '6px' }} />
              {terminalRunning ? 'Running...' : 'Run Code'}
            </button>
            <button className="glass-button save-btn" onClick={saveActiveFile} disabled={!activeFile}>
              <Save size={14} style={{ marginRight: '6px' }} />
              Save File
            </button>
          </div>
          
          <div className="file-info-badge">
            <Code size={14} />
            <span>{activeFile ? `${activeFile.name} (${getEditorLanguage(activeFile.name)})` : 'No file open'}</span>
          </div>
        </div>

        {/* Quick AI Action Pills */}
        <div className="quick-ai-toolbar">
          <button className="action-pill" onClick={() => triggerAiAction('EXPLAIN')} title="Explain code line-by-line">Explain</button>
          <button className="action-pill" onClick={() => triggerAiAction('BUG_DETECT')} title="Detect logic or syntax bugs">Find Bugs</button>
          <button className="action-pill" onClick={() => triggerAiAction('REFACTOR')} title="Remove duplicates & refactor readability">Refactor</button>
          <button className="action-pill" onClick={() => triggerAiAction('OPTIMIZE')} title="Optimize performance complexities">Optimize</button>
          <button className="action-pill" onClick={() => triggerAiAction('TEST_GEN')} title="Generate unit testing frameworks">Generate Tests</button>
          <button className="action-pill" onClick={() => triggerAiAction('REVIEW')} title="Professional grading review checks">Review</button>
          <button className="action-pill" onClick={() => triggerAiAction('SECURE')} title="Inspect common security exploits">Secure</button>
          <button className="action-pill" onClick={() => triggerAiAction('DOCUMENT')} title="Create Javadoc or README docs">Document</button>
          <button className="action-pill" onClick={() => {
            const target = prompt('Enter target programming language (e.g. Python, Java, JavaScript):', 'Python');
            if (target) triggerAiAction('CONVERT', '', target);
          }} title="Translate to another language">Convert</button>
        </div>

        {/* Monaco Editor Screen */}
        <div className="editor-screen-wrapper">
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
                padding: { top: 12 }
              }}
            />
          ) : (
            <div className="no-active-editor">
              <Code size={48} className="placeholder-icon" />
              <h3>No File Active</h3>
              <p>Double-click or click any file in the explorer tree to load it into the editor.</p>
            </div>
          )}
        </div>

        {/* Bottom Console Drawer */}
        <div className="terminal-drawer glass-panel">
          <div className="terminal-header">
            <div className="title">
              <Terminal size={14} />
              <span>CONSOLE OUTPUT</span>
            </div>
            <button className="clear-btn" onClick={() => { setTerminalStdout(''); setTerminalStderr(''); }}>Clear</button>
          </div>
          <div className="terminal-body">
            {terminalStdout && <pre className="stdout-text">{terminalStdout}</pre>}
            {terminalStderr && <pre className="stderr-text">{terminalStderr}</pre>}
            {!terminalStdout && !terminalStderr && <pre className="muted-text">Ready to run code...</pre>}
          </div>
        </div>
      </main>

      {/* 3. RIGHT PANEL: AI Copilot Drawer panel */}
      <aside className="ide-right-panel glass-panel">
        <div className="panel-tab-headers">
          <button className={`tab-hdr ${aiTab === 'chat' ? 'active' : ''}`} onClick={() => setAiTab('chat')}>AI COPILOT</button>
          <button className={`tab-hdr ${aiTab === 'review' ? 'active' : ''}`} onClick={() => setAiTab('review')}>CODE REVIEW</button>
          <button className={`tab-hdr ${aiTab === 'fix' ? 'active' : ''}`} onClick={() => setAiTab('fix')}>FIX & OPTIMIZE</button>
        </div>

        <div className="panel-tab-body">
          {/* Tab 1: AI Chat */}
          {aiTab === 'chat' && (
            <div className="chat-container">
              <div className="ai-chat-viewport">
                {aiMessages.length === 0 ? (
                  <div className="empty-chat-help">
                    <Bot size={36} className="bot-logo-pulse" />
                    <h4>Ask CodePilot AI anything!</h4>
                    <p>Get study guidance, ask questions, or request code helpers.</p>
                    
                    <div className="preset-suggestions">
                      <h5>Preset Quick prompts:</h5>
                      <button className="preset-pill" onClick={() => triggerAiAction('SQL_ASSIST', 'Create a JOIN query between Employee and Department')}>
                        Generate a SQL Join query
                      </button>
                      <button className="preset-pill" onClick={() => triggerAiAction('GIT', 'Create a commit message for fixing login validation')}>
                        Generate Git Commit Message
                      </button>
                      <button className="preset-pill" onClick={() => triggerAiAction('DEVOPS', 'Create a Jenkinsfile for a Maven Java project')}>
                        Create Jenkins CI/CD script
                      </button>
                      <button className="preset-pill" onClick={() => triggerAiAction('LEARNING', 'Explain recursion simply with practice questions')}>
                        Explain Recursion (Tutor)
                      </button>
                      <button className="preset-pill" onClick={() => triggerAiAction('API_GEN', 'Create a REST API for employee management')}>
                        Generate Employee REST API
                      </button>
                      <button className="preset-pill" onClick={() => triggerAiAction('DEPENDENCY', 'Add Selenium 4 dependency to Maven pom.xml')}>
                        Add Selenium 4 Maven config
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="chat-msg-list">
                    {aiMessages.map((msg, i) => (
                      <div key={i} className={`chat-message-row ${msg.sender.toLowerCase()}`}>
                        <div className="avatar">
                          {msg.sender === 'AI' ? <Bot size={14} /> : <User size={14} />}
                        </div>
                        <div className="msg-content">
                          <pre className="msg-text">{msg.text}</pre>
                        </div>
                      </div>
                    ))}
                    {aiLoading && (
                      <div className="chat-message-row ai loading">
                        <div className="avatar"><Bot size={14} /></div>
                        <div className="msg-content">Thinking...</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {aiError && <div className="ai-error-banner">{aiError}</div>}

              <div className="ai-chat-input-bar">
                <input 
                  type="text" 
                  placeholder="Ask CodePilot anything..." 
                  value={aiChatQuery}
                  onChange={(e) => setAiChatQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                />
                <button onClick={handleSendChat}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Code Review & Security */}
          {aiTab === 'review' && (
            <div className="review-container">
              <h4>Inspection Checklist</h4>
              <p className="subtitle">Automatic code grading & security vulnerabilities check.</p>
              
              {aiLoading ? (
                <Loading />
              ) : aiResponse && aiResponse.reviewItems ? (
                <div className="review-list">
                  {aiResponse.reviewItems.map((item, idx) => {
                    const isCritical = item.startsWith('🔴');
                    const isWarning = item.startsWith('🟠');
                    const isGood = item.startsWith('🟢');
                    let badgeClass = 'good';
                    if (isCritical) badgeClass = 'critical';
                    else if (isWarning) badgeClass = 'warning';

                    return (
                      <div key={idx} className={`review-card ${badgeClass}`}>
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="review-empty">
                  <CheckSquare size={36} className="placeholder-icon" />
                  <p>No checks active. Click the **Review** or **Secure** buttons above to run codebase static inspections.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Fix & Optimize Compare */}
          {aiTab === 'fix' && (
            <div className="fix-container">
              {aiLoading ? (
                <Loading />
              ) : aiResponse && (aiResponse.correctedCode || aiResponse.improvedComplexity) ? (
                <div className="fix-details">
                  <h4>Optimizations & Fixes</h4>
                  
                  {aiResponse.originalComplexity && (
                    <div className="complexity-card">
                      <h5>Complexity Comparison:</h5>
                      <div className="complexity-grid">
                        <div className="old">Original: <strong>{aiResponse.originalComplexity}</strong></div>
                        <div className="new">Improved: <strong>{aiResponse.improvedComplexity}</strong></div>
                      </div>
                    </div>
                  )}

                  {aiResponse.explanation && (
                    <div className="explanation-section">
                      <h5>AI Diagnostics:</h5>
                      <p>{aiResponse.explanation}</p>
                    </div>
                  )}

                  {aiResponse.correctedCode && (
                    <div className="corrected-code-wrapper">
                      <h5>Autofix Code Preview:</h5>
                      <pre className="corrected-code-preview">{aiResponse.correctedCode}</pre>
                      <button className="glass-button success apply-fix-btn" onClick={applyCorrectedCode}>
                        Apply Corrections
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="fix-empty">
                  <Cpu size={36} className="placeholder-icon" />
                  <p>Ready to apply fixes. Click **Find Bugs**, **Refactor**, or **Optimize** above to test diagnostics.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CodePilotIde;
