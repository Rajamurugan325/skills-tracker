import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import EmptyState from '../components/EmptyState';
import { Briefcase, Target, Award, CheckCircle } from 'lucide-react';
import './JobRole.css';

const JobRole = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readinessLoading, setReadinessLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchJobRoles = async () => {
    try {
      const response = await api.get('/api/job-roles');
      setRoles(response.data);
      if (response.data.length > 0) {
        // Default select first role
        setSelectedRoleId(response.data[0].id);
        fetchReadiness(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch job roles.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReadiness = async (roleId) => {
    setReadinessLoading(true);
    setSuccessMsg('');
    try {
      const response = await api.get(`/api/job-roles/${roleId}/readiness`);
      setReadiness(response.data);
    } catch (err) {
      console.error('Failed to fetch readiness.', err);
    } finally {
      setReadinessLoading(false);
    }
  };

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const handleRoleSelect = (roleId) => {
    setSelectedRoleId(roleId);
    fetchReadiness(roleId);
  };

  const setAsTarget = async () => {
    setSuccessMsg('');
    try {
      await api.post('/api/job-roles/select', { jobRoleId: selectedRoleId });
      setSuccessMsg('Successfully set as target role on your profile!');
    } catch (err) {
      console.error('Failed to set target role.', err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const activeRole = roles.find(r => r.id === selectedRoleId);

  return (
    <div className="job-role-wrapper">
      <div className="job-role-header">
        <Briefcase className="card-icon indigo" />
        <div>
          <h2>Job Role Matcher</h2>
          <p>Compare your current skill ratings against standard industry job requirements.</p>
        </div>
      </div>

      <div className="job-role-grid">
        {/* Left Side: Role selection cards */}
        <div className="role-selector-list">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => handleRoleSelect(r.id)}
              className={`role-select-card glass-panel ${r.id === selectedRoleId ? 'active' : ''}`}
            >
              <h4>{r.name}</h4>
              <p>{r.description.substring(0, 70)}...</p>
            </button>
          ))}
        </div>

        {/* Right Side: Readiness Details */}
        <div className="role-details-panel glass-panel">
          {readinessLoading ? (
            <Loading />
          ) : readiness ? (
            <div className="readiness-details-container">
              <div className="readiness-summary-header">
                <div>
                  <h3>{readiness.jobRoleName} Readiness</h3>
                  <p>{activeRole?.description}</p>
                </div>
                <div className="readiness-percentage-circle">
                  <h2>{readiness.readinessPercentage}%</h2>
                  <span>Match</span>
                </div>
              </div>

              {successMsg && <div className="job-role-success"><CheckCircle size={14} /> {successMsg}</div>}

              <div className="comparison-section">
                <h4>Skill Comparison Breakdown</h4>
                <div className="comparison-list">
                  {Object.keys(readiness.skillComparison).map((skillName) => {
                    const values = readiness.skillComparison[skillName];
                    const required = values[0];
                    const current = values[1];
                    const meetsRequirement = current >= required;

                    return (
                      <div key={skillName} className="comparison-item">
                        <div className="comparison-meta">
                          <span className="skill-title">{skillName}</span>
                          <span className={`status-text ${meetsRequirement ? 'text-green' : 'text-red'}`}>
                            {meetsRequirement ? 'Target Met' : 'Gap Identified'}
                          </span>
                        </div>
                        <div className="comparison-bars">
                          {/* Required Bar */}
                          <div className="bar-row">
                            <span className="bar-lbl">Required: {required}%</span>
                            <div className="bar-track gray">
                              <div className="bar-fill blue" style={{ width: `${required}%` }}></div>
                            </div>
                          </div>
                          {/* Current Bar */}
                          <div className="bar-row">
                            <span className="bar-lbl">Your Level: {Math.round(current)}%</span>
                            <div className="bar-track gray">
                              <div className="bar-fill purple" style={{ width: `${current}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button onClick={setAsTarget} className="glass-button target-set-btn">
                <Target size={16} />
                <span>Select as Target Role</span>
              </button>
            </div>
          ) : (
            <EmptyState title="Select a Role" message="Click a role from the left menu to view detail match parameters." />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobRole;
