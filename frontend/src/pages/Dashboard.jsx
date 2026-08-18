import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Award, CheckCircle, AlertTriangle, Flame, Layers } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [readiness, setReadiness] = useState(null);
  const [skills, setSkills] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [readinessRes, skillsRes, progressRes] = await Promise.all([
          api.get('/api/readiness'),
          api.get('/api/skills'),
          api.get('/api/progress')
        ]);
        setReadiness(readinessRes.data);
        setSkills(skillsRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        setError('Failed to load dashboard data. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  // Group skills by category to populate the radar chart dynamically
  const categoryScores = {};
  skills.forEach(s => {
    const cat = s.category;
    if (cat) {
      if (!categoryScores[cat]) {
        categoryScores[cat] = { sum: 0, count: 0 };
      }
      categoryScores[cat].sum += s.skillLevelPercentage;
      categoryScores[cat].count += 1;
    }
  });

  const categoryData = Object.keys(categoryScores).map(cat => {
    const avg = categoryScores[cat].sum / categoryScores[cat].count;
    const categoryLabels = {
      JAVA: 'Java Core',
      SQL: 'Database & SQL',
      DSA: 'Algorithms (DSA)',
      C: 'C Programming',
      PYTHON: 'Python Programming',
      FULLSTACK: 'Full Stack Web',
      DATA_ANALYTICS: 'Data Analytics',
      DATA_SCIENCE: 'Data Science',
      SOFTWARE_TESTING: 'Software Testing',
      AUTOMATION_TESTING: 'Automation Testing',
      GIT_GITHUB: 'Git & GitHub',
      DEVOPS: 'DevOps & CI/CD',
      APTITUDE: 'Aptitude & Logic',
      AI_TOOLS: 'AI & AI Tools',
      NETWORKS: 'Computer Networks',
      OPERATING_SYSTEMS: 'Operating Systems',
      DBMS_CONCEPTS: 'DBMS Concepts',
      CS_FUNDAMENTALS: 'CS Fundamentals',
      SOFT_SKILLS: 'Soft Skills & HR',
      DEVELOPER_TOOLS: 'Tools & Env'
    };
    return {
      subject: categoryLabels[cat] || cat,
      A: Math.round(avg),
      fullMark: 100
    };
  });

  if (categoryData.length < 3) {
    const defaults = ['JAVA', 'SQL', 'DSA'];
    defaults.forEach(d => {
      const label = d === 'JAVA' ? 'Java Core' : d === 'SQL' ? 'Database & SQL' : 'Algorithms (DSA)';
      if (!categoryData.some(item => item.subject === label)) {
        categoryData.push({ subject: label, A: 0, fullMark: 100 });
      }
    });
  }

  categoryData.push({ subject: 'Mock Interview', A: readiness?.mockInterviewScore || 0, fullMark: 100 });
  categoryData.push({ subject: 'Consistency', A: readiness?.consistencyScore || 0, fullMark: 100 });

  // Prepare bar chart data from progress
  const progressChartData = progress.slice(0, 7).map(p => ({
    name: p.topicName.substring(0, 12),
    Accuracy: Math.round(p.accuracyPercentage)
  }));

  // Calculate total counts
  const totalQuestionsPracticed = progress.reduce((sum, curr) => sum + curr.totalCount, 0);
  const totalCorrectAnswers = progress.reduce((sum, curr) => sum + curr.correctCount, 0);
  const totalWrongAnswers = totalQuestionsPracticed - totalCorrectAnswers;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid-top">
        {/* Readiness Circular Panel */}
        <div className="dashboard-card readiness-card glass-panel">
          <div className="card-header-with-icon">
            <Award className="card-icon indigo" />
            <h3>Technical Readiness</h3>
          </div>
          <div className="readiness-gauge">
            <div className="gauge-circle" style={{ '--percentage': readiness?.interviewReadiness }}>
              <div className="gauge-inner">
                <h1>{readiness?.interviewReadiness}%</h1>
                <span>Ready for Mock</span>
              </div>
            </div>
          </div>
          <div className="gauge-status">
            {readiness?.interviewReadiness >= 75 ? (
              <p className="status-high">Looking great! Ready for actual interviews.</p>
            ) : readiness?.interviewReadiness >= 50 ? (
              <p className="status-medium">Decent baseline. Solve targeted recommendations.</p>
            ) : (
              <p className="status-low">Foundation is weak. Practice core modules first.</p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-container">
          <div className="dashboard-card stat-box glass-panel">
            <Layers className="card-icon cyan" />
            <div className="stat-content">
              <span>Practiced Questions</span>
              <h2>{totalQuestionsPracticed}</h2>
            </div>
          </div>
          <div className="dashboard-card stat-box glass-panel">
            <CheckCircle className="card-icon green" />
            <div className="stat-content">
              <span>Correct Submissions</span>
              <h2>{totalCorrectAnswers}</h2>
            </div>
          </div>
          <div className="dashboard-card stat-box glass-panel">
            <AlertTriangle className="card-icon red" />
            <div className="stat-content">
              <span>Incorrect Answers</span>
              <h2>{totalWrongAnswers}</h2>
            </div>
          </div>
          <div className="dashboard-card stat-box glass-panel">
            <Flame className="card-icon orange" />
            <div className="stat-content">
              <span>Consistency Rating</span>
              <h2>{readiness?.consistencyScore}%</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-middle">
        {/* Category Performance Radar Chart */}
        <div className="dashboard-card chart-card glass-panel">
          <h3>Domain Proficiency Matrix</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={9} />
                <Radar name="Candidate" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic-Wise Progress Bar Chart */}
        <div className="dashboard-card chart-card glass-panel">
          <h3>Top Topic Accuracy (%)</h3>
          <div className="chart-container">
            {progressChartData.length === 0 ? (
              <div className="chart-placeholder">Start practicing to see topic performance charts.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={progressChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: '#111322', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 600 }}
                  />
                  <Bar dataKey="Accuracy" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-grid-bottom">
        {/* Strong Areas */}
        <div className="dashboard-card list-card glass-panel">
          <div className="card-header-with-icon">
            <CheckCircle className="card-icon green" />
            <h3>Strong Areas</h3>
          </div>
          <ul className="dashboard-list">
            {readiness?.strongAreas.map((area, i) => (
              <li key={i} className="list-item-ok">{area}</li>
            ))}
          </ul>
        </div>

        {/* Weak Areas */}
        <div className="dashboard-card list-card glass-panel">
          <div className="card-header-with-icon">
            <AlertTriangle className="card-icon red" />
            <h3>Weak Areas</h3>
          </div>
          <ul className="dashboard-list">
            {readiness?.weakAreas.map((area, i) => (
              <li key={i} className="list-item-warn">{area}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
