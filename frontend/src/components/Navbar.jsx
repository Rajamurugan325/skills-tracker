import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Award } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="navbar glass-panel">
      <div className="navbar-left">
        <h3>Welcome back, <span>{user.username}</span></h3>
        <p className="role-badge">
          <Award size={14} />
          <span>{user.roles?.includes('ROLE_ADMIN') ? 'Platform Admin' : 'Candidate'}</span>
        </p>
      </div>

      <div className="navbar-right">
        {!user.roles?.includes('ROLE_ADMIN') && (
          <div className="streak-indicator">
            <Sparkles size={16} className="spark-icon" />
            <span>Consistency Mode Active</span>
          </div>
        )}
        <div className="user-profile-circle">
          {user.username.substring(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
