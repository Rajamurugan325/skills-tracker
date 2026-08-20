import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { 
  User, Mail, Shield, CheckCircle, Award, Edit3, Save, FileCode, Settings, 
  Users, Globe, Activity, Terminal, Bug, BookOpen, Lock, Bell, 
  Sun, Moon, LogOut, MapPin, ExternalLink, Plus, Trash2, Cpu, Briefcase, 
  GraduationCap, ChevronRight, Check, AlertTriangle
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Tab states: 'overview', 'skills-projects', 'activity', 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  
  // Editing and dynamic profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    fullName: 'Rajamurugan R',
    summary: 'Senior Backend Developer and AI Enthusiast. Love building scalable APIs and microservices.',
    targetRole: 'Developer',
    primaryLanguage: 'Java',
    education: 'Bachelor of Computer Applications - BCA',
    experienceLevel: 'Intermediate',
    location: 'Chennai, Tamil Nadu, India'
  });

  // Skills progress percentage state
  const [skills, setSkills] = useState({
    Java: 85,
    C: 75,
    Python: 80,
    JavaScript: 78,
    React: 72,
    SQL: 88,
    'HTML/CSS': 82
  });

  // Projects list state
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'CodePilot Assistant',
      description: 'A sandbox compiler IDE with integrated AI assistant to detect logical errors and generate unit tests.',
      tech: ['React', 'Spring Boot', 'MySQL', 'Gemini API'],
      github: 'https://github.com/Rajamurugan325/skills-tracker',
      viewLink: 'http://localhost:5173/workspace'
    },
    {
      id: 2,
      name: 'E-Learning Skill Tracker',
      description: 'A platform that monitors candidate learning streaks and provides adaptive question difficulty levels.',
      tech: ['Java Core', 'JDBC', 'HTML/CSS', 'Docker'],
      github: 'https://github.com/Rajamurugan325/skills-tracker',
      viewLink: 'http://localhost:5173/'
    }
  ]);

  // Social Links state
  const [socials, setSocials] = useState({
    github: 'https://github.com/Rajamurugan325',
    linkedin: 'https://linkedin.com/in/rajamurugan-r',
    portfolio: 'https://rajamurugan.dev'
  });

  // AI Preferences state
  const [aiPrefs, setAiPrefs] = useState({
    preferredLanguage: 'Java',
    responseStyle: 'Detailed',
    explanationLevel: 'Beginner',
    codeDifficulty: 'Medium',
    autoSuggestions: true
  });

  // Form states for adding items
  const [newProject, setNewProject] = useState({ name: '', description: '', tech: '', github: '', viewLink: '' });
  const [showAddProject, setShowAddProject] = useState(false);

  // Load backend profile on mount & restore user localStorage
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profiles/me');
      setProfile(response.data);
      
      // Load local storage values if they exist
      const savedForm = localStorage.getItem(`cp_profile_${response.data.username}`);
      const savedProjects = localStorage.getItem(`cp_projects_${response.data.username}`);
      const savedSocials = localStorage.getItem(`cp_socials_${response.data.username}`);
      const savedPrefs = localStorage.getItem(`cp_prefs_${response.data.username}`);
      const savedSkills = localStorage.getItem(`cp_skills_${response.data.username}`);

      if (savedForm) {
        setEditForm(JSON.parse(savedForm));
      } else {
        setEditForm(prev => ({
          ...prev,
          username: response.data.username || '',
          email: response.data.email || '',
          summary: response.data.summary || prev.summary,
          targetRole: response.data.targetRole || prev.targetRole,
          primaryLanguage: response.data.primaryLanguage || prev.primaryLanguage
        }));
      }

      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedSocials) setSocials(JSON.parse(savedSocials));
      if (savedPrefs) setAiPrefs(JSON.parse(savedPrefs));
      if (savedSkills) setSkills(JSON.parse(savedSkills));

    } catch (err) {
      setError('Failed to fetch profile metadata.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Save back to backend through PUT api/profiles/me
      const response = await api.put('/api/profiles/me', {
        username: editForm.username,
        email: editForm.email,
        summary: editForm.summary,
        targetRole: editForm.targetRole,
        primaryLanguage: editForm.primaryLanguage
      });
      setProfile(response.data);

      // Save custom fields into local storage
      localStorage.setItem(`cp_profile_${response.data.username}`, JSON.stringify(editForm));
      localStorage.setItem(`cp_prefs_${response.data.username}`, JSON.stringify(aiPrefs));
      localStorage.setItem(`cp_socials_${response.data.username}`, JSON.stringify(socials));
      localStorage.setItem(`cp_skills_${response.data.username}`, JSON.stringify(skills));
      
      setIsEditing(false);
    } catch (err) {
      alert('Error updating profile settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description) return;
    const projectItem = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      tech: newProject.tech.split(',').map(t => t.trim()),
      github: newProject.github || '#',
      viewLink: newProject.viewLink || '#'
    };
    const updatedProjects = [...projects, projectItem];
    setProjects(updatedProjects);
    localStorage.setItem(`cp_projects_${profile.username}`, JSON.stringify(updatedProjects));
    setNewProject({ name: '', description: '', tech: '', github: '', viewLink: '' });
    setShowAddProject(false);
  };

  const handleDeleteProject = (id) => {
    if (!window.confirm('Delete this project?')) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem(`cp_projects_${profile.username}`, JSON.stringify(updated));
  };

  const handleSkillChange = (skill, val) => {
    const updated = { ...skills, [skill]: parseInt(val) };
    setSkills(updated);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="profile-dashboard-layout">
      {/* 1. Header Hero Panel */}
      <header className="profile-hero-card glass-panel">
        <div className="avatar-section">
          <div className="avatar-circle">
            <span>{editForm.fullName.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="hero-details">
            <div className="name-badge-row">
              <h2>{editForm.fullName}</h2>
              <span className="role-tag">{editForm.targetRole}</span>
            </div>
            <p className="username-text">@{profile.username} • {editForm.location}</p>
            <p className="bio-summary">"{editForm.summary}"</p>
          </div>
        </div>
        
        <div className="hero-actions">
          <button className="glass-button primary edit-btn" onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing) setActiveTab('settings');
          }}>
            {isEditing ? <Save size={14} style={{ marginRight: '6px' }} /> : <Edit3 size={14} style={{ marginRight: '6px' }} />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <nav className="profile-nav-tabs">
        <button className={`tab-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <User size={15} /> Overview
        </button>
        <button className={`tab-link ${activeTab === 'skills-projects' ? 'active' : ''}`} onClick={() => setActiveTab('skills-projects')}>
          <BookOpen size={15} /> Skills & Projects
        </button>
        <button className={`tab-link ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
          <Activity size={15} /> Recent Activity
        </button>
        <button className={`tab-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={15} /> Account Settings
        </button>
      </nav>

      {/* Tab Contents View Area */}
      <div className="profile-tab-content">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="tab-overview-grid">
            {/* Developer Info Card */}
            <div className="overview-card glass-panel">
              <div className="card-hdr">
                <GraduationCap size={16} />
                <h3>Developer Information</h3>
              </div>
              <div className="info-list-items">
                <div className="info-detail-row">
                  <span className="lbl">Education</span>
                  <span className="val">{editForm.education}</span>
                </div>
                <div className="info-detail-row">
                  <span className="lbl">Experience</span>
                  <span className="val">{editForm.experienceLevel}</span>
                </div>
                <div className="info-detail-row">
                  <span className="lbl">Preferred Language</span>
                  <span className="val">{editForm.primaryLanguage}</span>
                </div>
                <div className="info-detail-row">
                  <span className="lbl">Email Contact</span>
                  <span className="val">{profile.email}</span>
                </div>
              </div>
            </div>

            {/* Coding Stats Card */}
            <div className="overview-card glass-panel">
              <div className="card-hdr">
                <Terminal size={16} />
                <h3>Coding Statistics</h3>
              </div>
              <div className="stats-box-grid">
                <div className="stat-widget green">
                  <h4>142</h4>
                  <span>Problems Solved</span>
                </div>
                <div className="stat-widget purple">
                  <h4>{projects.length}</h4>
                  <span>Projects Completed</span>
                </div>
                <div className="stat-widget blue">
                  <h4>15,240</h4>
                  <span>Code Generated</span>
                </div>
                <div className="stat-widget orange">
                  <h4>84</h4>
                  <span>Bugs Fixed</span>
                </div>
                <div className="stat-widget cyan">
                  <h4>32</h4>
                  <span>Code Reviews</span>
                </div>
                <div className="stat-widget pink">
                  <h4>210</h4>
                  <span>Coding Sessions</span>
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="overview-card full-width glass-panel">
              <div className="card-hdr">
                <Award size={16} />
                <h3>Earned Achievements</h3>
              </div>
              <div className="achievements-badges-row">
                <div className="badge-item glass-panel" title="Solved over 100 questions">
                  <Award className="badge-icon gold" />
                  <div>
                    <h5>100 Problems Solved</h5>
                    <span>Milestone Master</span>
                  </div>
                </div>
                <div className="badge-item glass-panel" title="Deploys first workspace project">
                  <FileCode className="badge-icon blue" />
                  <div>
                    <h5>First Project</h5>
                    <span>Code Deployer</span>
                  </div>
                </div>
                <div className="badge-item glass-panel" title="Fixed over 50 logical bugs">
                  <Bug className="badge-icon red" />
                  <div>
                    <h5>Bug Hunter</h5>
                    <span>Debugger Expert</span>
                  </div>
                </div>
                <div className="badge-item glass-panel" title="Maintained 7 day streak">
                  <Activity className="badge-icon green" />
                  <div>
                    <h5>7-Day Streak</h5>
                    <span>Consistency Master</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Cards */}
            <div className="overview-card full-width glass-panel socials-card">
              <div className="card-hdr">
                <Globe size={16} />
                <h3>Developer Social Links</h3>
              </div>
              <div className="socials-row">
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="social-pill glass-panel github">
                  <Globe size={16} /> GitHub Profile
                </a>
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-pill glass-panel linkedin">
                  <Users size={16} /> LinkedIn Connect
                </a>
                <a href={socials.portfolio} target="_blank" rel="noopener noreferrer" className="social-pill glass-panel portfolio">
                  <Globe size={16} /> Portfolio Website
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Skills & Projects */}
        {activeTab === 'skills-projects' && (
          <div className="tab-skills-projects-grid">
            {/* Skills progress percentages */}
            <div className="skills-rating-card glass-panel">
              <div className="card-hdr">
                <Cpu size={16} />
                <h3>Programming Skills Ratings</h3>
              </div>
              <div className="skills-progress-list">
                {Object.keys(skills).map((skill, index) => (
                  <div key={index} className="skill-progress-row">
                    <div className="skill-label-row">
                      <span>{skill}</span>
                      <span>{skills[skill]}%</span>
                    </div>
                    <div className="progress-bg">
                      <div className="progress-bar" style={{ width: `${skills[skill]}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects list */}
            <div className="projects-showcase-card glass-panel">
              <div className="card-hdr-actions">
                <div className="title">
                  <Briefcase size={16} />
                  <h3>Projects Portfolio</h3>
                </div>
                <button className="glass-button secondary small-btn" onClick={() => setShowAddProject(!showAddProject)}>
                  <Plus size={12} style={{ marginRight: '4px' }} /> Add Project
                </button>
              </div>

              {showAddProject && (
                <form onSubmit={handleAddProject} className="add-project-form glass-panel">
                  <h5>Add New Portfolio Project</h5>
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Project Name" 
                      value={newProject.name} 
                      onChange={e => setNewProject({...newProject, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <textarea 
                      placeholder="Brief Description..." 
                      value={newProject.description} 
                      onChange={e => setNewProject({...newProject, description: e.target.value})} 
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Technologies (comma separated: e.g. React, Spring Boot)" 
                      value={newProject.tech} 
                      onChange={e => setNewProject({...newProject, tech: e.target.value})} 
                    />
                  </div>
                  <div className="form-group dual">
                    <input 
                      type="text" 
                      placeholder="GitHub Link" 
                      value={newProject.github} 
                      onChange={e => setNewProject({...newProject, github: e.target.value})} 
                    />
                    <input 
                      type="text" 
                      placeholder="Live View Link" 
                      value={newProject.viewLink} 
                      onChange={e => setNewProject({...newProject, viewLink: e.target.value})} 
                    />
                  </div>
                  <div className="btn-row">
                    <button className="glass-button success" type="submit">Save Project</button>
                    <button className="glass-button danger" type="button" onClick={() => setShowAddProject(false)}>Cancel</button>
                  </div>
                </form>
              )}

              <div className="projects-grid">
                {projects.map((proj) => (
                  <div key={proj.id} className="project-item-card glass-panel">
                    <div className="proj-hdr">
                      <h4>{proj.name}</h4>
                      <button className="delete-proj-btn" onClick={() => handleDeleteProject(proj.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <p>{proj.description}</p>
                    <div className="tech-tags-list">
                      {proj.tech.map((t, idx) => (
                        <span key={idx} className="tech-tag">{t}</span>
                      ))}
                    </div>
                    <div className="proj-anchors">
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" className="proj-btn flex-center">
                        <ExternalLink size={12} style={{ marginRight: '6px' }} /> GitHub Repository
                      </a>
                      <a href={proj.viewLink} className="proj-btn primary flex-center">
                        <ExternalLink size={12} style={{ marginRight: '6px' }} /> Launch Workspace
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Recent Activity */}
        {activeTab === 'activity' && (
          <div className="tab-activity-container glass-panel">
            <div className="card-hdr">
              <Activity size={16} />
              <h3>Activity Timeline</h3>
            </div>
            <div className="timeline-items-list">
              <div className="timeline-item">
                <div className="timeline-badge green">
                  <FileCode size={14} />
                </div>
                <div className="timeline-content">
                  <p>Generated a Java binary search script using CodePilot AI Assistant</p>
                  <span>10 mins ago • Main.java</span>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-badge red">
                  <Bug size={14} />
                </div>
                <div className="timeline-content">
                  <p>Resolved NullPointerException in JVM compiler setup</p>
                  <span>2 hours ago • Workspace Runner</span>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-badge blue">
                  <Award size={14} />
                </div>
                <div className="timeline-content">
                  <p>Achieved target readiness score of 88% in Java Core</p>
                  <span>Yesterday • Adaptive Test Platform</span>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-badge purple">
                  <BookOpen size={14} />
                </div>
                <div className="timeline-content">
                  <p>Completed 10 questions in SQL Database Practice Track</p>
                  <span>3 days ago • DB Joins & Subqueries</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Account Settings & Profile Forms */}
        {activeTab === 'settings' && (
          <div className="tab-settings-grid">
            {/* Edit details form */}
            <div className="settings-panel-card glass-panel">
              <div className="card-hdr">
                <User size={16} />
                <h3>Personal Information Settings</h3>
              </div>
              <form onSubmit={handleProfileSave} className="settings-form">
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.fullName} 
                    onChange={e => setEditForm({...editForm, fullName: e.target.value})} 
                  />
                </div>
                <div className="input-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={editForm.username} 
                    onChange={e => setEditForm({...editForm, username: e.target.value})} 
                    disabled 
                  />
                </div>
                <div className="input-group">
                  <label>Email Contact</label>
                  <input 
                    type="email" 
                    value={editForm.email} 
                    onChange={e => setEditForm({...editForm, email: e.target.value})} 
                    disabled
                  />
                </div>
                <div className="input-group">
                  <label>Short Bio</label>
                  <textarea 
                    value={editForm.summary} 
                    onChange={e => setEditForm({...editForm, summary: e.target.value})}
                  ></textarea>
                </div>
                <div className="input-group-row">
                  <div className="input-group">
                    <label>Role</label>
                    <select 
                      value={editForm.targetRole} 
                      onChange={e => setEditForm({...editForm, targetRole: e.target.value})}
                    >
                      <option value="Student">Student</option>
                      <option value="Developer">Developer</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Experience Level</label>
                    <select 
                      value={editForm.experienceLevel} 
                      onChange={e => setEditForm({...editForm, experienceLevel: e.target.value})}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    value={editForm.location} 
                    onChange={e => setEditForm({...editForm, location: e.target.value})} 
                  />
                </div>

                <div className="skills-ratings-edit-section">
                  <h5>Adjust Skills Progress percentages</h5>
                  <div className="edit-skills-grid">
                    {Object.keys(skills).map((skill, index) => (
                      <div key={index} className="edit-skill-row">
                        <label>{skill}</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={skills[skill]} 
                          onChange={e => handleSkillChange(skill, e.target.value)} 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button className="glass-button success form-save-btn" type="submit">
                  <Save size={14} style={{ marginRight: '6px' }} /> Save Developer Info
                </button>
              </form>
            </div>

            {/* AI Preferences configurations */}
            <div className="settings-panel-card glass-panel">
              <div className="card-hdr">
                <Cpu size={16} />
                <h3>AI Assistant Preferences</h3>
              </div>
              <div className="ai-preferences-form">
                <div className="input-group">
                  <label>Preferred Programming Language</label>
                  <select 
                    value={aiPrefs.preferredLanguage}
                    onChange={e => setAiPrefs({...aiPrefs, preferredLanguage: e.target.value})}
                  >
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="C">C</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="SQL">SQL</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>AI Response Style</label>
                  <select 
                    value={aiPrefs.responseStyle}
                    onChange={e => setAiPrefs({...aiPrefs, responseStyle: e.target.value})}
                  >
                    <option value="Concise">Concise & Direct Code</option>
                    <option value="Detailed">Detailed with Explanations</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Explanation Level</label>
                  <select 
                    value={aiPrefs.explanationLevel}
                    onChange={e => setAiPrefs({...aiPrefs, explanationLevel: e.target.value})}
                  >
                    <option value="Beginner">Beginner Friendly</option>
                    <option value="Expert">Advanced Developer Reference</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Autocompletion Difficulty</label>
                  <select 
                    value={aiPrefs.codeDifficulty}
                    onChange={e => setAiPrefs({...aiPrefs, codeDifficulty: e.target.value})}
                  >
                    <option value="Easy">Junior level templates</option>
                    <option value="Medium">Medium scale architectures</option>
                    <option value="Hard">Advanced complexity algos</option>
                  </select>
                </div>

                <div className="preference-toggle-row">
                  <div className="text-info">
                    <h5>Auto Code Suggestions</h5>
                    <span>Trigger real-time Monaco inline code predictions.</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={aiPrefs.autoSuggestions}
                      onChange={e => setAiPrefs({...aiPrefs, autoSuggestions: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Social links configuration */}
            <div className="settings-panel-card glass-panel">
              <div className="card-hdr">
                <Globe size={16} />
                <h3>Social Profiles Configuration</h3>
              </div>
              <div className="socials-edit-form">
                <div className="input-group">
                  <label>GitHub Account Url</label>
                  <input 
                    type="text" 
                    value={socials.github} 
                    onChange={e => setSocials({...socials, github: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>LinkedIn Account Url</label>
                  <input 
                    type="text" 
                    value={socials.linkedin} 
                    onChange={e => setSocials({...socials, linkedin: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Portfolio Site Link</label>
                  <input 
                    type="text" 
                    value={socials.portfolio} 
                    onChange={e => setSocials({...socials, portfolio: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Other Security settings */}
            <div className="settings-panel-card glass-panel security-card">
              <div className="card-hdr">
                <Lock size={16} />
                <h3>Security & Privacy Preferences</h3>
              </div>
              <div className="settings-checkboxes">
                <div className="check-row">
                  <input type="checkbox" id="email-notif" defaultChecked />
                  <label htmlFor="email-notif">Receive Email Notifications</label>
                </div>
                <div className="check-row">
                  <input type="checkbox" id="public-profile" defaultChecked />
                  <label htmlFor="public-profile">Publicly Visible Profile</label>
                </div>
                <div className="check-row">
                  <input type="checkbox" id="telemetry" />
                  <label htmlFor="telemetry">Share telemetry usage data to train local AI models</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
