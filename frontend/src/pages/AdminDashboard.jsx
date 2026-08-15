import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Shield, Database, Users } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ usersCount: 0, questionsCount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [qRes, uRes] = await Promise.all([
          api.get('/api/admin/questions'),
          api.get('/api/admin/users')
        ]);
        setStats({
          questionsCount: qRes.data.length,
          usersCount: uRes.data.length
        });
      } catch (err) {
        console.error('Failed to load admin stats.', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <Shield className="card-icon indigo" />
        <div>
          <h2>Admin Control Center</h2>
          <p>Examine system analytics, manage the question seed bank, and oversee candidate profiles.</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card glass-panel" onClick={() => navigate('/admin/questions')}>
          <Database size={32} className="text-indigo" />
          <div>
            <h2>{stats.questionsCount}</h2>
            <p>Seeded Question Bank</p>
          </div>
        </div>

        <div className="admin-stat-card glass-panel" onClick={() => navigate('/admin/users')}>
          <Users size={32} className="text-green" />
          <div>
            <h2>{stats.usersCount}</h2>
            <p>Registered Candidates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
