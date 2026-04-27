import React, { useState, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Dashboard from './Frontend/Dashboard.jsx'
import QuizPage from './Frontend/QuizPage.jsx'
import LoginPage from './Frontend/LoginPage.jsx'
import RegisterPage from './Frontend/RegisterPage.jsx'
import ForgotPassword from './Frontend/ForgotPassword.jsx'

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Restore session from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute user={user}>
            <Dashboard user={user} onLogout={handleLogout} onNavigateToQuiz={() => navigate('/quiz')} />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/quiz"
        element={(
          <ProtectedRoute user={user}>
            <QuizPage user={user} onLogout={handleLogout} onBackToDashboard={() => navigate('/dashboard')} />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App
