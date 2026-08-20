import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Send, Bot, User, Sparkles, RefreshCw, HelpCircle, Mic, Volume2, VolumeX, Paperclip, FileText, X } from 'lucide-react';
import './AiAssistant.css';

const AiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  
  const chatEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const predefinedPrompts = [
    { text: 'Analyze my weak areas', desc: 'Checks your wrong answers and stats' },
    { text: 'Check my consistency status', desc: 'Evaluates your Consistency Mode and streaks' },
    { text: 'Give me a study plan', desc: 'Generates a custom topic checklist' },
    { text: 'Explain JavaScript closure', desc: 'Concept study with examples' }
  ];

  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Try Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const speakText = (text, index) => {
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (speakingIndex === index) {
        setSpeakingIndex(null);
        return;
      }
    }

    const cleanText = text.replace(/[*#`>_\-]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    
    utterance.onend = () => {
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setSpeakingIndex(null);
    };

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAttachmentUrl = (path) => {
    if (!path) return '';
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    return `${baseUrl.replace(/\/$/, '')}${path}`;
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await api.get('/api/ai/history');
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching chat history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (textToSend) => {
    const msgText = textToSend || input;
    if (!msgText.trim() && !selectedFile) return;

    if (!textToSend) setInput('');
    setError('');
    
    const currentFile = selectedFile;
    const currentPreview = filePreview;
    
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    const userMessage = {
      message: msgText,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      fileUrl: currentPreview ? currentPreview : (currentFile ? '#' : null),
      fileType: currentFile ? currentFile.type : null,
      fileName: currentFile ? currentFile.name : null
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      let res;
      if (currentFile) {
        const formData = new FormData();
        formData.append('message', msgText);
        formData.append('file', currentFile);
        res = await api.post('/api/ai/chat', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        res = await api.post('/api/ai/chat', { message: msgText });
      }
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    // Local clear for UI representation if desired
    setMessages([]);
  };

  const parseInlineMarkdown = (text) => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
      
    const html = escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
      
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let cleanLine = line.trim();
      
      if (cleanLine.startsWith('####')) {
        return <h4 key={idx}>{cleanLine.replace('####', '').trim()}</h4>;
      }
      if (cleanLine.startsWith('###')) {
        return <h3 key={idx}>{cleanLine.replace('###', '').trim()}</h3>;
      }
      if (cleanLine.startsWith('##')) {
        return <h2 key={idx}>{cleanLine.replace('##', '').trim()}</h2>;
      }
      
      if (cleanLine.startsWith('>')) {
        return (
          <blockquote key={idx} className="chat-blockquote">
            {cleanLine.replace('>', '').trim()}
          </blockquote>
        );
      }
      
      if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
        const content = cleanLine.substring(1).trim();
        return <li key={idx} className="chat-li">{parseInlineMarkdown(content)}</li>;
      }
      
      if (/^\d+\./.test(cleanLine)) {
        const content = cleanLine.replace(/^\d+\./, '').trim();
        return <li key={idx} className="chat-li-num">{parseInlineMarkdown(content)}</li>;
      }
      
      if (cleanLine === '') {
        return <div key={idx} style={{ height: '8px' }} />;
      }
      
      return <p key={idx} className="chat-p">{parseInlineMarkdown(line)}</p>;
    });
  };

  if (historyLoading) return <Loading />;

  return (
    <div className="ai-assistant-wrapper">
      <div className="ai-assistant-header glass-panel">
        <div className="header-meta">
          <Bot className="assistant-logo-icon" />
          <div>
            <h2>CodePilot AI Assistant</h2>
            <p>Retrieval-Augmented Study Copilot & Tutor</p>
          </div>
        </div>
        <button className="clear-chat-btn glass-button" onClick={fetchChatHistory} title="Reload History">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="chat-viewport glass-panel">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <Sparkles className="empty-state-icon" />
            <h3>Ask CodePilot AI anything!</h3>
            <p>Get study guidance, detailed explanations of concept topics, or review questions you struggle with.</p>
            
            <div className="prompts-grid">
              {predefinedPrompts.map((prompt, i) => (
                <button 
                  key={i} 
                  className="prompt-suggestion-card glass-panel"
                  onClick={() => sendMessage(prompt.text)}
                >
                  <strong>{prompt.text}</strong>
                  <span>{prompt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, i) => (
              <div key={i} className={`message-bubble-row ${msg.sender.toLowerCase()}`}>
                <div className="sender-avatar">
                  {msg.sender === 'AI' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-bubble glass-panel">
                  <div className="message-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '20px' }}>
                    <span className="sender-name" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      {msg.sender === 'AI' ? 'CodePilot AI' : 'You'}
                    </span>
                    {msg.sender === 'AI' && (
                      <button 
                        className="tts-speak-btn" 
                        onClick={() => speakText(msg.message, i)}
                        title={speakingIndex === i ? "Stop Reading" : "Read Aloud"}
                        style={{ background: 'transparent', border: 'none', color: speakingIndex === i ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                      >
                        {speakingIndex === i ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    )}
                  </div>
                  <div className="message-content">
                    {msg.sender === 'AI' ? renderMarkdown(msg.message) : msg.message}
                    {msg.fileUrl && (
                      <div className="message-attachment" style={{ marginTop: '10px', maxWidth: '100%' }}>
                        {msg.fileType?.startsWith('image/') ? (
                          <img 
                            src={msg.fileUrl.startsWith('blob:') ? msg.fileUrl : getAttachmentUrl(msg.fileUrl)} 
                            alt={msg.fileName} 
                            style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }} 
                          />
                        ) : msg.fileType?.startsWith('video/') ? (
                          <video 
                            src={msg.fileUrl.startsWith('blob:') ? msg.fileUrl : getAttachmentUrl(msg.fileUrl)} 
                            controls 
                            style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }} 
                          />
                        ) : (
                          <a 
                            href={msg.fileUrl.startsWith('blob:') ? '#' : getAttachmentUrl(msg.fileUrl)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="attachment-link glass-panel"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                          >
                            <FileText size={16} />
                            <span>{msg.fileName || 'View Attachment'}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="message-time">{msg.timestamp || 'Just now'}</span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message-bubble-row ai loading">
                <div className="sender-avatar">
                  <Bot size={16} className="spin-slow" />
                </div>
                <div className="message-bubble glass-panel loading-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {error && <div className="chat-error-bar"><Error message={error} /></div>}

      {selectedFile && (
        <div className="file-upload-preview-bar glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px', margin: '0 0 10px 0', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(255, 255, 255, 0.015)' }}>
          {filePreview ? (
            <img src={filePreview} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
          ) : (
            <FileText size={24} style={{ color: 'var(--primary)' }} />
          )}
          <div style={{ flexGrow: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedFile.name}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
          <button onClick={removeFile} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="chat-input-area glass-panel">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          accept="image/*,video/*,application/pdf,text/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        />
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about your performance, topics, or explanations..."
          disabled={loading}
        />
        <button
          className="attach-button glass-button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach Image, Video, or Document"
          style={{ width: '36px', height: '36px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '5px' }}
        >
          <Paperclip size={16} />
        </button>
        <button
          className={`mic-button glass-button ${isListening ? 'active' : ''}`}
          onClick={toggleListening}
          title={isListening ? "Listening... Click to Stop" : "Voice Input (Speech to Text)"}
          style={{ width: '36px', height: '36px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '5px' }}
        >
          <Mic size={16} />
        </button>
        <button 
          className="send-message-btn glass-button"
          onClick={() => sendMessage()}
          disabled={(!input.trim() && !selectedFile) || loading}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
