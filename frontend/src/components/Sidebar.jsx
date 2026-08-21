import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, ClipboardCheck, History, 
  ShieldAlert, Sparkles, Users, Briefcase, User, LogOut, Shield, Database, Bot, Code 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        <h2>CODE<span>PILOT</span></h2>
      </div>

      <nav className="sidebar-menu">
        {isAdmin() ? (
          <>
            <div className="menu-group">ADMIN CONTROL</div>
            <Link to="/admin/dashboard" className={`menu-item ${isActive('/admin/dashboard')}`}>
              <Shield size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/questions" className={`menu-item ${isActive('/admin/questions')}`}>
              <Database size={18} />
              <span>Questions</span>
            </Link>
            <Link to="/admin/users" className={`menu-item ${isActive('/admin/users')}`}>
              <Users size={18} />
              <span>Users</span>
            </Link>
          </>
        ) : (
          <>
            <div className="menu-group">LEARNING SPACE</div>
            <Link to="/dashboard" className={`menu-item ${isActive('/dashboard')}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/practice" className={`menu-item ${isActive('/practice')}`}>
              <BookOpen size={18} />
              <span>Practice Questions</span>
            </Link>
            <Link to="/quiz" className={`menu-item ${isActive('/quiz')}`}>
              <ClipboardCheck size={18} />
              <span>Adaptive Quiz</span>
            </Link>

            <div className="menu-group">PERFORMANCE</div>
            <Link to="/history" className={`menu-item ${isActive('/history')}`}>
              <History size={18} />
              <span>Quiz History</span>
            </Link>
            <Link to="/wrong-answers" className={`menu-item ${isActive('/wrong-answers')}`}>
              <ShieldAlert size={18} />
              <span>Wrong Answers</span>
            </Link>
            <Link to="/recommendations" className={`menu-item ${isActive('/recommendations')}`}>
              <Sparkles size={18} />
              <span>Recommendations</span>
            </Link>

            <div className="menu-group">CAREER READY</div>
            <Link to="/mock-interview" className={`menu-item ${isActive('/mock-interview')}`}>
              <Users size={18} />
              <span>Mock Interview</span>
            </Link>
            <Link to="/job-role" className={`menu-item ${isActive('/job-role')}`}>
              <Briefcase size={18} />
              <span>Job Role Matcher</span>
            </Link>
          </>
        )}

        <div className="menu-group">ACCOUNT</div>
        <Link to="/profile" className={`menu-item ${isActive('/profile')}`}>
          <User size={18} />
          <span>Profile</span>
        </Link>
        <button onClick={logout} className="menu-item logout-btn">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
