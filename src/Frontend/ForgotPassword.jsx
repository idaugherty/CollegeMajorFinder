import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { checkResetEmail, resetPassword } from '../services/api.js';
import {
  normalizeEmail,
  validateMurrayEmail,
  validatePassword,
  validatePasswordConfirm
} from '../utils/validation.js';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // step 1: enter email, step 2: set new password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailError = validateMurrayEmail(email);
    if (emailError) {
      return setError(emailError);
    }

    setLoading(true);

    try {
      await checkResetEmail({
        email: normalizeEmail(email),
        checkOnly: true
      });
      setStep(2);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return setError(passwordError);
    }
    const confirmError = validatePasswordConfirm(newPassword, confirm);
    if (confirmError) {
      return setError(confirmError);
    }

    setLoading(true);

    try {
      await resetPassword({
        email: normalizeEmail(email),
        newPassword
      });
      setSuccess('Password updated! Redirecting to login...');
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
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">
          {step === 1 ? 'Enter your email to get started' : `Setting new password for ${email}`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
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

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Confirm New Password</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                required
                autoComplete="new-password"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="auth-links">
          <Link className="link-btn" to="/login">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
