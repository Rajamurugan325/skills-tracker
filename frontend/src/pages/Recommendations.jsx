import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import EmptyState from '../components/EmptyState';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import './Recommendations.css';

const Recommendations = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/api/recommendations');
      setRecs(response.data);
    } catch (err) {
      setError('Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="recs-wrapper">
      <div className="recs-header">
        <Sparkles className="card-icon indigo" />
        <div>
          <h2>Smart Study Recommendations</h2>
          <p>Personalized action items computed by the adaptive engine based on your weak topics.</p>
        </div>
      </div>

      {recs.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          message="Your topic accuracy ratings are solid (above 70%) or you haven't taken enough quizzes yet. Great job!"
          actionText="Take a Quiz"
          onAction={() => navigate('/quiz')}
        />
      ) : (
        <div className="recs-list">
          {recs.map((r) => (
            <div key={r.id} className="rec-card glass-panel">
              <div className="rec-badge-row">
                <span className="category-tag">{r.category}</span>
                <span className={`priority-tag ${r.priority.toLowerCase()}`}>
                  {r.priority} PRIORITY
                </span>
              </div>
              
              <div className="rec-info">
                <h4>Improve {r.topicName}</h4>
                <p>{r.actionMessage}</p>
              </div>

              <button onClick={() => navigate('/practice')} className="glass-button next-btn">
                <span>Start Practice</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
