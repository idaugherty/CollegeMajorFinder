import React, { useMemo, useState, useEffect } from 'react';
import './QuizPage.css';
import { QUIZ_QUESTIONS, getDefaultQuizAnswers, getRankedQuizMatches } from './quizConfig.js';
import { getMajors, getQuizProfile, saveQuizProfile } from '../services/api.js';

const QuizPage = ({ user, onBackToDashboard, onLogout }) => {
  const [majors, setMajors] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState(getDefaultQuizAnswers);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  // tracks which result card has its "why this matched" breakdown open
  const [expandedReasonId, setExpandedReasonId] = useState(null);

  const rankedMatches = useMemo(() => getRankedQuizMatches(majors, quizAnswers), [majors, quizAnswers]);

  useEffect(() => {
    const loadMajors = async () => {
      try {
        const data = await getMajors();
        setMajors(data);
      } catch (error) {
        setStatusMessage(error.message || 'Could not load majors right now.');
      } finally {
        setLoading(false);
      }
    };

    loadMajors();
  }, []);

  useEffect(() => {
    const loadSavedProfile = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const data = await getQuizProfile(user.id);
        if (!data) {
          return;
        }

        if (data.answers && typeof data.answers === 'object') {
          setQuizAnswers({ ...getDefaultQuizAnswers(), ...data.answers });
        }
        if (Array.isArray(data.results) && data.results.length > 0) {
          setShowResults(true);
        }
      } catch (error) {
        setStatusMessage(error.message || 'Could not load saved quiz profile.');
      }
    };

    loadSavedProfile();
  }, [user?.id]);

  const handleScaleChange = (questionId, value) => {
    setQuizAnswers((current) => ({
      ...current,
      [questionId]: value
    }));
    setStatusMessage('');
  };

  const handleRank = () => {
    setShowResults(true);
    setStatusMessage('Ranking updated. Save your profile to keep these results.');
  };

  const handleReset = () => {
    setQuizAnswers(getDefaultQuizAnswers());
    setShowResults(false);
    setStatusMessage('');
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      setStatusMessage('You must be signed in to save your profile.');
      return;
    }

    setSaving(true);
    setStatusMessage('');

    try {
      await saveQuizProfile({
        userId: user.id,
        answers: quizAnswers,
        results: rankedMatches
      });
      setStatusMessage('Quiz profile saved. Your results will be there next time you sign in.');
    } catch (error) {
      setStatusMessage(error.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading your quiz...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="app-title">Major Match Quiz</h1>
            <p className="app-subtitle">Personalize your major recommendations</p>
          </div>
          <div className="header-user">
            <span className="user-greeting">Hello, {user?.display_name || user?.email}</span>
            <button className="logout-btn" onClick={onLogout}>Sign Out</button>
          </div>
        </div>
      </header>

      <div className="quiz-container">
        <div className="quiz-card">
          <p className="quiz-intro">
            Rate each statement on a 1 to 5 scale. 1 means "Not me" and 5 means "Very much me".
          </p>

          <div className="quiz-scale-legend">
            <span>1: Not me</span>
            <span>3: Neutral</span>
            <span>5: Very much me</span>
          </div>

          <div className="quiz-questions">
            {QUIZ_QUESTIONS.map((question) => (
              <div key={question.id} className="quiz-question-row">
                <p className="quiz-question-text">{question.label}</p>
                <div className="quiz-scale-buttons" role="group" aria-label={question.label}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={`${question.id}-${value}`}
                      type="button"
                      className={`scale-btn ${quizAnswers[question.id] === value ? 'active' : ''}`}
                      onClick={() => handleScaleChange(question.id, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-actions">
            <button type="button" className="quiz-btn" onClick={handleRank}>
              Rank My Majors
            </button>
            <button type="button" className="quiz-btn secondary" onClick={handleReset}>
              Reset Quiz
            </button>
            <button type="button" className="quiz-btn save" onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" className="quiz-btn secondary" onClick={onBackToDashboard}>
              Back to Dashboard
            </button>
          </div>

          {statusMessage && <p className="quiz-status">{statusMessage}</p>}

          {showResults && (
            <div className="quiz-results">
              <h3 className="quiz-results-title">Your Ranked Matches</h3>
              <p className="quiz-results-subtitle">
                These majors are ranked by your preferences and how strongly each major aligns to your selected interests.
              </p>

              <div className="quiz-results-list">
                {rankedMatches.map((major, index) => (
                  <div key={`${major.id}-${index}`} className="quiz-result-card">
                    <div className="quiz-rank-badge">#{index + 1}</div>
                    <div className="quiz-result-content">
                      <p className="quiz-major-name">{major.major}</p>
                      <p className="quiz-major-meta">{major.Department} · {major.collegeOfMajor}</p>
                      <div className="quiz-score-row">
                        <span>Match Score: {Math.round(major.rankScore)}%</span>
                        <span>Traits matched: {major.matchedTraitCount}</span>
                      </div>
                      {major.reasons.length > 0 && (
                        <p className="quiz-reasons">Best aligned with: {major.reasons.join(', ')}</p>
                      )}
                      {/* only render this section if the scoring gave us trait data to show */}
                      {major.matchedTraits && major.matchedTraits.length > 0 && (
                        <div className="why-matched-section">
                          {/* toggle open/close per card — clicking one doesn't close others */}
                          <button
                            type="button"
                            className="why-matched-toggle"
                            onClick={() => setExpandedReasonId(id => id === major.id ? null : major.id)}
                          >
                            {expandedReasonId === major.id ? '▲ Hide breakdown' : '▼ Why this matched you'}
                          </button>
                          {expandedReasonId === major.id && (
                            <div className="why-matched-detail">
                              {/* write a plain English sentence; fall back if no strong interests */}
                              <p className="why-matched-intro">
                                {major.reasons.length > 0
                                  ? `Your strong interest in ${major.reasons.join(' and ')} drives this match.`
                                  : 'This major aligns with several of your interest areas.'}
                              </p>
                              <ul className="trait-breakdown-list">
                                {major.matchedTraits.map(trait => (
                                  <li key={trait.label} className={`trait-item trait-${trait.strength}`}>
                                    <span className="trait-label">{trait.label}</span>
                                    {/* 5 dots, filled up to the user's score for that trait */}
                                    <span className="trait-score-bar">
                                      {[1,2,3,4,5].map(v => (
                                        <span
                                          key={v}
                                          className={`trait-pip${v <= trait.score ? ' filled' : ''}`}
                                        />
                                      ))}
                                    </span>
                                    <span className={`trait-strength-label strength-${trait.strength}`}>
                                      {trait.strength}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
