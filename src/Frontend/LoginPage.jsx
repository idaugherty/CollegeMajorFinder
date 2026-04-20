import React, { useState } from 'react';
import './Auth.css';

const LoginPage = ({ onLogin, onNavigate }) => {
  const domainRegex = /^[a-zA-Z0-9._%+-]+@murraystate\.edu$/i;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!domainRegex.test(email.trim())) {
      return setError('Email must end with @murraystate.edu');
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      } else {
        localStorage.setItem('user', JSON.stringify(data));
        onLogin(data);
      }
    } catch {
      setError('Could not connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-app-title">College Major Finder</h1>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@murraystate.edu"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          <button className="link-btn" onClick={() => onNavigate('forgot')}>
            Forgot your password?
          </button>
          <span className="auth-divider">·</span>
          <button className="link-btn" onClick={() => onNavigate('register')}>
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
