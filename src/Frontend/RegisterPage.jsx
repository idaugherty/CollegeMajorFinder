import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { registerUser } from '../services/api.js';
import {
  normalizeEmail,
  validateDisplayName,
  validateMurrayEmail,
  validatePassword,
  validatePasswordConfirm
} from '../utils/validation.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailError = validateMurrayEmail(email);
    if (emailError) {
      return setError(emailError);
    }
    const displayNameError = validateDisplayName(displayName);
    if (displayNameError) {
      return setError(displayNameError);
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return setError(passwordError);
    }
    const confirmError = validatePasswordConfirm(password, confirm);
    if (confirmError) {
      return setError(confirmError);
    }

    setLoading(true);

    try {
      await registerUser({
        email: normalizeEmail(email),
        password,
        display_name: displayName.trim() || null
      });
      setSuccess('Account created! You can now sign in.');
      setTimeout(() => navigate('/login'), 1200);
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
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join to start exploring majors</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

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
              placeholder="Min. 6 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-links">
          <span>Already have an account?</span>
          <Link className="link-btn" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
