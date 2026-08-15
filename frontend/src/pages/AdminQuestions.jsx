import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Modal from '../components/Modal';
import { Database, PlusCircle, Trash } from 'lucide-react';
import './Admin.css';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    difficulty: 'EASY',
    category: 'JAVA',
    topicId: 1
  });

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/api/admin/questions');
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to fetch question bank.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question from seed bank?')) return;
    try {
      await api.delete(`/api/admin/questions/${id}`);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      console.error('Failed to delete question.', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/admin/questions', form);
      setQuestions([...questions, response.data]);
      setModalOpen(false);
      setForm({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        difficulty: 'EASY',
        category: 'JAVA',
        topicId: 1
      });
    } catch (err) {
      console.error('Failed to create question.', err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="admin-wrapper">
      <div className="admin-header-row">
        <div className="admin-header-left">
          <Database className="card-icon indigo" />
          <div>
            <h2>Question Repository</h2>
            <p>Modify technical questions and adjust topics parameters.</p>
          </div>
        </div>
        <button onClick={() => setModalOpen(true)} className="glass-button create-btn">
          <PlusCircle size={16} />
          <span>Add Question</span>
        </button>
      </div>

      <div className="questions-table-container glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Question</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td><span className="table-badge category">{q.category}</span></td>
                <td className="table-q-text">{q.questionText}</td>
                <td>
                  <span className={`table-badge difficulty ${q.difficulty.toLowerCase()}`}>
                    {q.difficulty}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleDelete(q.id)} className="delete-action-btn">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Question">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Question Text</label>
            <textarea
              required
              rows={3}
              value={form.questionText}
              onChange={e => setForm({ ...form, questionText: e.target.value })}
              className="glass-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Option A</label>
              <input required type="text" value={form.optionA} onChange={e => setForm({ ...form, optionA: e.target.value })} className="glass-input" />
            </div>
            <div className="form-group">
              <label>Option B</label>
              <input required type="text" value={form.optionB} onChange={e => setForm({ ...form, optionB: e.target.value })} className="glass-input" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Option C</label>
              <input required type="text" value={form.optionC} onChange={e => setForm({ ...form, optionC: e.target.value })} className="glass-input" />
            </div>
            <div className="form-group">
              <label>Option D</label>
              <input required type="text" value={form.optionD} onChange={e => setForm({ ...form, optionD: e.target.value })} className="glass-input" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Correct Option</label>
              <select value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })} className="glass-input select-box">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="glass-input select-box">
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="glass-input select-box">
                <option value="JAVA">JAVA</option>
                <option value="SQL">SQL</option>
                <option value="DSA">DSA</option>
                <option value="C">C</option>
                <option value="PYTHON">PYTHON</option>
                <option value="FULLSTACK">FULLSTACK</option>
              </select>
            </div>
            <div className="form-group">
              <label>Topic ID</label>
              <input type="number" min={1} max={15} value={form.topicId} onChange={e => setForm({ ...form, topicId: parseInt(e.target.value) })} className="glass-input" />
            </div>
          </div>

          <div className="form-group">
            <label>Explanation</label>
            <textarea
              required
              rows={2}
              value={form.explanation}
              onChange={e => setForm({ ...form, explanation: e.target.value })}
              className="glass-input"
            />
          </div>

          <button type="submit" className="glass-button save-btn">Save Question</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminQuestions;
