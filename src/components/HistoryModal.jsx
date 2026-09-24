// src/components/HistoryModal.jsx
import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { getSavedAttempts, clearQuestionHistory } from '../utils/shuffle';
import { History, Award, Trash2, ArrowLeft, Clock, Calendar, CheckCircle2, RotateCcw } from 'lucide-react';

export default function HistoryModal() {
  const { setCurrentView, historyCount, totalQuestionsBankCount } = useQuiz();
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    setAttempts(getSavedAttempts());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your exam attempt history and question progress?')) {
      localStorage.removeItem('mba_quiz_attempts_v1');
      clearQuestionHistory();
      setAttempts([]);
      window.location.reload();
    }
  };

  const masteryPercent = Math.round((historyCount / totalQuestionsBankCount) * 100);

  return (
    <div className="history-page-wrapper">
      <section className="history-header">
        <button className="back-home-btn" onClick={() => setCurrentView('landing')}>
          <ArrowLeft size={16} />
          <span>Return to Quiz</span>
        </button>

        <div className="history-title-row">
          <div className="history-title-group">
            <h1 className="history-title">
              <History size={24} className="title-icon" />
              Candidate Assessment History
            </h1>
            <p className="history-desc">
              Track your exam performance, scores, and mastery of the 1,000 question MBA bank.
            </p>
          </div>

          {attempts.length > 0 && (
            <button className="clear-history-btn" onClick={handleClearHistory}>
              <Trash2 size={16} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Global Progress Card */}
        <div className="mastery-summary-card">
          <div className="mastery-info">
            <span className="mastery-label">Unique Questions Encountered</span>
            <span className="mastery-numbers">{historyCount} / {totalQuestionsBankCount} Questions</span>
          </div>
          <div className="mastery-bar-bg">
            <div className="mastery-bar-fill" style={{ width: `${masteryPercent}%` }}></div>
          </div>
          <span className="mastery-footnote">
            {masteryPercent}% of the 1,000 question bank covered so far. Non-repetition shuffle ensures new questions appear on future attempts.
          </span>
        </div>
      </section>

      {/* Past Attempts List */}
      <section className="attempts-section">
        <h2 className="section-subtitle">Past Exam Attempts ({attempts.length})</h2>

        {attempts.length === 0 ? (
          <div className="no-attempts-card">
            <p>You haven't completed any exam sessions yet. Start a quiz from the course selection page!</p>
            <button className="primary-btn" onClick={() => setCurrentView('landing')}>
              Begin Your First Quiz
            </button>
          </div>
        ) : (
          <div className="attempts-grid">
            {attempts.map((att, idx) => {
              const dateStr = new Date(att.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={idx} className="attempt-card">
                  <div className="attempt-top">
                    <div className="attempt-grade-pill" style={{ backgroundColor: `${att.gradeColor}20`, color: att.gradeColor, borderColor: att.gradeColor }}>
                      <Award size={14} />
                      <span>{att.grade} ({att.percentage}%)</span>
                    </div>
                    <div className="attempt-date">
                      <Calendar size={13} />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div className="attempt-score-row">
                    <span className="attempt-score-big">{att.score} / {att.total}</span>
                    <span className="attempt-time">
                      <Clock size={13} /> {Math.round(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                    </span>
                  </div>

                  <div className="attempt-courses">
                    <strong>Courses:</strong> {att.coursesAttempted?.join(', ') || 'MBA Core'}
                  </div>

                  {att.courseBreakdown && att.courseBreakdown.length > 0 && (
                    <div className="attempt-breakdown-mini">
                      {att.courseBreakdown.map(cb => (
                        <div key={cb.code} className="mini-course-row">
                          <span className="mini-code">{cb.code}:</span>
                          <span className="mini-val">{cb.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
