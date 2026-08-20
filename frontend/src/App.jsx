import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Loading from './components/Loading';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Quiz from './pages/Quiz';
import History from './pages/History';
import WrongAnswers from './pages/WrongAnswers';
import Recommendations from './pages/Recommendations';
import MockInterview from './pages/MockInterview';
import JobRole from './pages/JobRole';
import Profile from './pages/Profile';
import AiAssistant from './pages/AiAssistant';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminQuestions from './pages/AdminQuestions';
import AdminUsers from './pages/AdminUsers';

// Private Route Guard
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  return user ? children : <Navigate to="/login" />;
};

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <Loading />;
  return user && isAdmin() ? children : <Navigate to="/dashboard" />;
};

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Space */}
          <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/practice" element={<PrivateRoute><AppLayout><Practice /></AppLayout></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><AppLayout><Quiz /></AppLayout></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><AppLayout><History /></AppLayout></PrivateRoute>} />
          <Route path="/wrong-answers" element={<PrivateRoute><AppLayout><WrongAnswers /></AppLayout></PrivateRoute>} />
          <Route path="/recommendations" element={<PrivateRoute><AppLayout><Recommendations /></AppLayout></PrivateRoute>} />
          <Route path="/ai-assistant" element={<PrivateRoute><AppLayout><AiAssistant /></AppLayout></PrivateRoute>} />
          <Route path="/mock-interview" element={<PrivateRoute><AppLayout><MockInterview /></AppLayout></PrivateRoute>} />
          <Route path="/job-role" element={<PrivateRoute><AppLayout><JobRole /></AppLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />

          {/* Admin Protected Control Center */}
          <Route path="/admin/dashboard" element={<AdminRoute><AppLayout><AdminDashboard /></AppLayout></AdminRoute>} />
          <Route path="/admin/questions" element={<AdminRoute><AppLayout><AdminQuestions /></AppLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AppLayout><AdminUsers /></AppLayout></AdminRoute>} />

          {/* Default Wildcards */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
