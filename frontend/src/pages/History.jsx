import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { History as HistoryIcon, Eye, Calendar, Award } from 'lucide-react';
import './History.css';

const History = () => {
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/results');
      setAttempts(response.data);
    } catch (err) {
      setError('Failed to fetch attempt history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const openDetails = async (attemptId) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/results/${attemptId}`);
      setSelectedAttempt(response.data);
      setModalOpen(true);
    } catch (err) {
      console.error('Failed to load details.', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && attempts.length === 0) return <Loading />;
  if (error) return <Error message={error} />;

  const formatDate = (dateString) => {
    if (!dateString) return 'Completed';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-wrapper">
      <div className="history-header">
        <HistoryIcon className="card-icon indigo" />
        <div>
          <h2>Attempt History</h2>
          <p>Review your historical scores and correct solutions.</p>
        </div>
      </div>

      {attempts.length === 0 ? (
        <EmptyState 
          title="No Quizzes Taken" 
          message="You haven't completed any adaptive quizzes yet. Take a quiz to begin tracking results."
        />
      ) : (
        <div className="history-list">
          {attempts.map((att) => {
            const pct = Math.round((att.score / att.totalQuestions) * 100);
            return (
              <div key={att.attemptId} className="history-item glass-panel">
                <div className="item-meta">
                  <span className="attempt-badge">ID: #{att.attemptId}</span>
                  <p className="date-text">
                    <Calendar size={14} />
                    {formatDate(att.endTime)}
                  </p>
                </div>

                <div className="item-score">
                  <Award size={18} className="score-icon" />
                  <div>
                    <h4>{pct}% Accuracy</h4>
                    <span>{att.score} / {att.totalQuestions} Correct</span>
                  </div>
                </div>

                <button 
                  onClick={() => openDetails(att.attemptId)} 
                  className="glass-button secondary review-btn"
                >
                  <Eye size={16} />
                  <span>Review Answers</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Solutions Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Review Attempt #${selectedAttempt?.attemptId}`}
      >
        {selectedAttempt && (
          <div className="history-modal-solutions">
            <div className="modal-score-summary glass-panel">
              <h3>{Math.round((selectedAttempt.score / selectedAttempt.totalQuestions) * 100)}% Accuracy</h3>
              <p>{selectedAttempt.score} correct out of {selectedAttempt.totalQuestions} questions</p>
            </div>
            
            <div className="modal-solutions-list">
              {selectedAttempt.answers.map((ans, idx) => (
                <div key={idx} className={`modal-solution-item ${ans.isCorrect ? 'correct' : 'incorrect'}`}>
                  <p className="modal-q-text"><strong>Q{idx + 1}.</strong> {ans.questionText}</p>
                  <div className="modal-ans-meta">
                    <p>Your option: <span className="user-opt">{ans.selectedAnswer || 'None'}</span></p>
                    <p>Correct option: <span className="correct-opt">{ans.correctAnswer}</span></p>
                  </div>
                  <div className="modal-explanation">
                    <p><strong>Explanation:</strong> {ans.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default History;
