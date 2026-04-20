import React, { useState } from 'react';
import './Auth.css';

const ForgotPassword = ({ onNavigate }) => {
  const domainRegex = /^[a-zA-Z0-9._%+-]+@murraystate\.edu$/i;
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

    if (!domainRegex.test(email.trim())) {
      return setError('Email must end with @murraystate.edu');
    }

    setLoading(true);

    try {
      // Check the email exists before allowing reset
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), checkOnly: true }),
      });

      // If server returns 404 the email doesn't exist
      if (response.status === 404) {
        setError('No account found with that email address');
      } else {
        setStep(2);
      }
    } catch {
      setError('Could not connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirm) {
      return setError('Passwords do not match');
    }
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      } else {
        setSuccess('Password updated! Redirecting to login...');
        setTimeout(() => onNavigate('login'), 1500);
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
          <button className="link-btn" onClick={() => onNavigate('login')}>
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
