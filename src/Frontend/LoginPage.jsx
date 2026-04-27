import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import { loginUser } from '../services/api.js';
import { normalizeEmail, validateMurrayEmail } from '../utils/validation.js';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailError = validateMurrayEmail(email);
    if (emailError) {
      return setError(emailError);
    }
    if (!password.trim()) {
      return setError('Password is required.');
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: normalizeEmail(email),
        password
      });
      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data);
    } catch (apiError) {
      setError(apiError.message);
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
          <Link className="link-btn" to="/forgot-password">
            Forgot your password?
          </Link>
          <span className="auth-divider">·</span>
          <Link className="link-btn" to="/register">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
