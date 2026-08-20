import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Send, Bot, User, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';
import './AiAssistant.css';

const AiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  
  const chatEndRef = useRef(null);

  const predefinedPrompts = [
    { text: 'Analyze my weak areas', desc: 'Checks your wrong answers and stats' },
    { text: 'Give me a study plan', desc: 'Generates a custom topic checklist' },
    { text: 'Explain JavaScript closure', desc: 'Concept study with examples' },
    { text: 'Explain SQL database indexing', desc: 'Performance and query optimization' }
  ];

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
    if (!msgText.trim() || loading) return;

    if (!textToSend) setInput('');
    setError('');
    
    // Add user message to UI immediately
    const userMessage = {
      message: msgText,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await api.post('/api/ai/chat', { message: msgText });
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
                  <div className="message-content">
                    {msg.sender === 'AI' ? renderMarkdown(msg.message) : msg.message}
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

      <div className="chat-input-area glass-panel">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about your performance, topics, or explanations..."
          disabled={loading}
        />
        <button 
          className="send-message-btn glass-button"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
