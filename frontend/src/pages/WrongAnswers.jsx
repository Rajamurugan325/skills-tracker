import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import EmptyState from '../components/EmptyState';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';
import './WrongAnswers.css';

const WrongAnswers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWrongAnswers = async () => {
    try {
      const response = await api.get('/api/wrong-answers');
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch wrong answer metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWrongAnswers();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const wrongAnswers = data?.wrongAnswers || [];
  const mostWrongMap = data?.mostWrongTopics || {};

  // Map most wrong topics into Recharts format
  const chartData = Object.keys(mostWrongMap).map(topic => ({
    name: topic.substring(0, 15),
    Errors: mostWrongMap[topic]
  })).sort((a, b) => b.Errors - a.Errors).slice(0, 5); // top 5 worst topics

  return (
    <div className="wrong-wrapper">
      <div className="wrong-header">
        <ShieldAlert className="card-icon indigo" />
        <div>
          <h2>Wrong Answer Analysis</h2>
          <p>Review and study questions you answered incorrectly during assessments.</p>
        </div>
      </div>

      {wrongAnswers.length === 0 ? (
        <EmptyState 
          title="Perfect Records!" 
          message="You haven't registered any wrong answers yet. Take quizzes or practice questions to test your skills."
        />
      ) : (
        <>
          <div className="wrong-grid-top">
            {/* Errors count chart */}
            <div className="wrong-card chart-box glass-panel">
              <h3>Error Frequency by Topic</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ background: '#111322', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                      labelStyle={{ color: '#f8fafc', fontWeight: 600 }}
                    />
                    <Bar dataKey="Errors" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart recommendations block */}
            <div className="wrong-card recommendations-box glass-panel">
              <h3>Focus Recommendations</h3>
              <div className="recommendations-list-mini">
                {chartData.length > 0 ? (
                  chartData.map((topic, i) => (
                    <div key={i} className="rec-mini-item">
                      <BookOpen size={16} className="text-red" />
                      <div>
                        <h5>Practice {topic.name}</h5>
                        <p>You have logged {topic.Errors} incorrect answers. Review basic concepts.</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-recs">Practice more to generate smart study action items.</p>
                )}
              </div>
            </div>
          </div>

          <div className="wrong-solutions-section">
            <h3>Incorrect Submissions Review</h3>
            <div className="solutions-list">
              {wrongAnswers.map((w, idx) => (
                <div key={w.id} className="solution-item glass-panel incorrect-border">
                  <div className="solution-head">
                    <span className="q-number">Record #{w.id}</span>
                    <span className="difficulty-tag red">{w.difficulty}</span>
                  </div>
                  <p className="q-text">{w.questionText}</p>
                  
                  <div className="q-answers-details">
                    <p>Your Selection: <span className="incorrect-highlight">{w.selectedAnswer}</span></p>
                    <p>Correct Option: <span className="correct-highlight">{w.correctAnswer}</span></p>
                  </div>
                  
                  <div className="q-explanation">
                    <h5>Explanation & Core Concept:</h5>
                    <p>{w.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WrongAnswers;
