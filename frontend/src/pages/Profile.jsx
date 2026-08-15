import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { User, Mail, Shield, CheckCircle, Award } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profiles/me');
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile metadata.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <User className="card-icon indigo" />
        <div>
          <h2>User Profile</h2>
          <p>Manage your account settings, target tracks, and view stats summary.</p>
        </div>
      </div>

      <div className="profile-content-grid">
        {/* Account Details */}
        <div className="profile-card info-card glass-panel">
          <h3>Account Specifications</h3>
          <div className="info-list">
            <div className="info-item">
              <User size={18} className="text-indigo" />
              <div>
                <span>Username</span>
                <h4>{profile.username}</h4>
              </div>
            </div>

            <div className="info-item">
              <Mail size={18} className="text-indigo" />
              <div>
                <span>Email Address</span>
                <h4>{profile.email}</h4>
              </div>
            </div>

            <div className="info-item">
              <Shield size={18} className="text-indigo" />
              <div>
                <span>Role Mappings</span>
                <h4>{profile.roles?.join(', ')}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Prep Stats */}
        <div className="profile-card stats-card glass-panel">
          <h3>Portfolio Milestones</h3>
          <div className="achievement-grid">
            <div className="achieve-widget glass-panel">
              <Award size={24} className="text-green" />
              <div>
                <h2>{profile.targetJobRoleName || 'Not selected'}</h2>
                <span>Active Target Role</span>
              </div>
            </div>
            
            <div className="achieve-widget glass-panel">
              <CheckCircle size={24} className="text-cyan" />
              <div>
                <h2>{profile.interviewReadinessScore}%</h2>
                <span>Calculated Readiness</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
