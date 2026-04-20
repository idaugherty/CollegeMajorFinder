import React, { useState, useEffect } from 'react'
import Dashboard from './Frontend/Dashboard.jsx'
import LoginPage from './Frontend/LoginPage.jsx'
import RegisterPage from './Frontend/RegisterPage.jsx'
import ForgotPassword from './Frontend/ForgotPassword.jsx'

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  // Restore session from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(saved));
      setPage('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  };

  if (page === 'dashboard' && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }
  if (page === 'register') {
    return <RegisterPage onNavigate={setPage} />;
  }
  if (page === 'forgot') {
    return <ForgotPassword onNavigate={setPage} />;
  }
  return <LoginPage onLogin={handleLogin} onNavigate={setPage} />;
}

export default App
