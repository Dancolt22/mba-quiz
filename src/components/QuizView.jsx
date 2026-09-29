// src/components/QuizView.jsx
import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { getCourseById } from '../data/courses';
import QuestionNavModal from './QuestionNavModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Timer, 
  Grid, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  LogOut, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';

export default function QuizView() {
  const {
    questions,
    currentIndex,
    currentQuestion,
    userAnswers,
    selectAnswer,
    flaggedQuestions,
    toggleFlag,
    nextQuestion,
    prevQuestion,
    timeRemaining,
    submitQuiz,
    quizSettings,
    resetToLanding
  } = useQuiz();

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if a modal is open
      if (isNavOpen || showSubmitConfirm || showExitConfirm) return;

      if (!currentQuestion) return;

      // Option selection by 1-4 or A-D
      if (['1', 'a', 'A'].includes(e.key)) {
        selectAnswer(currentQuestion.id, 0);
      } else if (['2', 'b', 'B'].includes(e.key)) {
        selectAnswer(currentQuestion.id, 1);
      } else if (['3', 'c', 'C'].includes(e.key)) {
        selectAnswer(currentQuestion.id, 2);
      } else if (['4', 'd', 'D'].includes(e.key)) {
        selectAnswer(currentQuestion.id, 3);
      } else if (e.key === 'ArrowRight') {
        nextQuestion();
      } else if (e.key === 'ArrowLeft') {
        prevQuestion();
      } else if (['f', 'F'].includes(e.key)) {
        toggleFlag(currentQuestion.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, isNavOpen, showSubmitConfirm, showExitConfirm, currentIndex]);

  if (!currentQuestion) {
    return (
      <div className="quiz-empty-state">
        <h2>No questions loaded.</h2>
        <button className="primary-btn" onClick={resetToLanding}>Return to Course Selection</button>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isFlagged = flaggedQuestions.has(currentQuestion.id);
  const selectedAnswerIdx = userAnswers[currentQuestion.id];
  const isAnswered = selectedAnswerIdx !== undefined;

  const courseMeta = getCourseById(currentQuestion.courseCode.toLowerCase().replace(' ', '')) || {
    color: '#3B82F6',
    code: currentQuestion.courseCode,
    title: currentQuestion.courseTitle
  };

  // Format countdown timer
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isTimeCritical = timeRemaining > 0 && timeRemaining <= 60;

  // Unanswered count
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;

  const isPracticeMode = quizSettings.mode === 'practice';

  return (
    <div className="quiz-view-wrapper">
      {/* Top Header Controls */}
      <div className="quiz-top-bar">
        <div className="top-bar-left">
          <button
            className="exit-quiz-btn"
            onClick={() => setShowExitConfirm(true)}
            title="Exit Quiz"
          >
            <LogOut size={16} />
            <span>Exit</span>
          </button>

          <div className="course-badge" style={{ backgroundColor: `${courseMeta.color}20`, color: courseMeta.color, borderColor: `${courseMeta.color}40` }}>
            <span className="badge-code">{currentQuestion.courseCode}</span>
            <span className="badge-sep">&bull;</span>
            <span className="badge-title">{currentQuestion.courseTitle}</span>
          </div>
        </div>

        <div className="top-bar-center">
          <div className="q-counter">
            Question <span className="current-num">{currentIndex + 1}</span> of <span className="total-num">{totalQuestions}</span>
          </div>
        </div>

        <div className="top-bar-right">
          {/* Timer in exam mode */}
          {quizSettings.mode === 'exam' && (
            <div className={`quiz-timer ${isTimeCritical ? 'critical pulse' : ''}`}>
              <Timer size={16} className="timer-icon" />
              <span className="timer-digits">{formatTime(timeRemaining)}</span>
            </div>
          )}

          {/* Flag question */}
          <button
            className={`flag-btn ${isFlagged ? 'flagged' : ''}`}
            onClick={() => toggleFlag(currentQuestion.id)}
            title={isFlagged ? 'Unflag question' : 'Flag question for review (Key: F)'}
          >
            <Bookmark size={16} className={isFlagged ? 'fill-icon' : ''} />
            <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
          </button>

          {/* Question Grid Matrix */}
          <button
            className="nav-grid-toggle-btn"
            onClick={() => setIsNavOpen(true)}
            title="View Question Grid"
          >
            <Grid size={16} />
            <span>Grid ({answeredCount}/{totalQuestions})</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress-track">
        <div 
          className="quiz-progress-fill"
          style={{ width: `${progressPercent}%`, backgroundColor: courseMeta.color }}
        />
      </div>

      {/* Question Main Card Area */}
      <main className="quiz-main-container">
        <div className="question-card">
          {/* Topic & Chapter Badge */}
          <div className="question-topic-bar">
            {currentQuestion.chapterNumber && (
              <span className="chapter-pill" style={{ borderColor: `${courseMeta.color}60`, color: courseMeta.color, backgroundColor: `${courseMeta.color}15` }}>
                Chapter {currentQuestion.chapterNumber}: {currentQuestion.chapterShortTitle || currentQuestion.chapterTitle}
              </span>
            )}
            <span className="topic-pill">{currentQuestion.topic}</span>
            {isFlagged && (
              <span className="flagged-pill">
                <Bookmark size={12} fill="currentColor" /> Flagged for Review
              </span>
            )}
          </div>

          {/* Question Text */}
          <h2 className="question-text">{currentQuestion.question}</h2>

          {/* Options Grid */}
          <div className="options-container">
            {currentQuestion.options.map((optionText, optIdx) => {
              const optLabel = ['A', 'B', 'C', 'D'][optIdx];
              const isSelected = selectedAnswerIdx === optIdx;
              const isCorrectAnswer = optIdx === currentQuestion.correctAnswer;

              let optionClass = 'option-btn';
              if (isSelected) optionClass += ' selected';

              // Practice mode immediate feedback coloring
              if (isPracticeMode && isAnswered) {
                if (isCorrectAnswer) {
                  optionClass += ' practice-correct';
                } else if (isSelected && !isCorrectAnswer) {
                  optionClass += ' practice-incorrect';
                }
              }

              return (
                <button
                  key={optIdx}
                  className={optionClass}
                  onClick={() => selectAnswer(currentQuestion.id, optIdx)}
                >
                  <div className="option-label-circle">
                    {optLabel}
                  </div>
                  <div className="option-text-body">
                    {optionText}
                  </div>
                  <div className="option-feedback-icon">
                    {isPracticeMode && isAnswered && isCorrectAnswer && (
                      <CheckCircle2 size={20} className="icon-correct" />
                    )}
                    {isPracticeMode && isAnswered && isSelected && !isCorrectAnswer && (
                      <XCircle size={20} className="icon-incorrect" />
                    )}
                    {!isPracticeMode && isSelected && (
                      <Check size={18} className="icon-selected" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Practice Mode Explanation Box */}
          {isPracticeMode && isAnswered && (
            <div className={`practice-explanation-card ${selectedAnswerIdx === currentQuestion.correctAnswer ? 'correct-glow' : 'incorrect-glow'}`}>
              <div className="explanation-header">
                <Info size={18} className="info-icon" />
                <span className="explanation-title">
                  {selectedAnswerIdx === currentQuestion.correctAnswer ? 'Correct Answer!' : 'Academic Explanation:'}
                </span>
              </div>
              <p className="explanation-content">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="quiz-bottom-bar">
        <div className="bottom-bar-left">
          <button
            className="nav-arrow-btn"
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            title="Previous Question (Left Arrow)"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>
        </div>

        <div className="bottom-bar-center">
          <div className="answered-status-text">
            {isAnswered ? (
              <span className="status-saved"><Check size={14} /> Answer Recorded</span>
            ) : (
              <span className="status-pending">Select an option (1-4 or A-D)</span>
            )}
          </div>
        </div>

        <div className="bottom-bar-right">
          {currentIndex < totalQuestions - 1 ? (
            <button
              className="nav-arrow-btn primary"
              onClick={nextQuestion}
              title="Next Question (Right Arrow)"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              className="submit-exam-btn"
              onClick={() => setShowSubmitConfirm(true)}
            >
              <span>Finish & Submit</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </footer>

      {/* Question Navigator Drawer/Modal */}
      <QuestionNavModal
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
      />

      {/* Confirm Submit Modal */}
      {showSubmitConfirm && (
        <div className="modal-backdrop" onClick={() => setShowSubmitConfirm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-warning">
              <AlertTriangle size={32} />
            </div>
            <h3 className="modal-title">Ready to Submit Quiz?</h3>
            <p className="modal-body">
              You have answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
              {unansweredCount > 0 && (
                <span className="unanswered-warning">
                  <br />Notice: You have <strong>{unansweredCount} unanswered</strong> {unansweredCount === 1 ? 'question' : 'questions'}.
                </span>
              )}
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setShowSubmitConfirm(false)}
              >
                Review Answers
              </button>
              <button
                className="modal-btn confirm"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  submitQuiz();
                }}
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Exit Modal */}
      {showExitConfirm && (
        <div className="modal-backdrop" onClick={() => setShowExitConfirm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-danger">
              <LogOut size={32} />
            </div>
            <h3 className="modal-title">Exit Current Quiz?</h3>
            <p className="modal-body">
              Your current progress in this quiz attempt will be discarded. Are you sure you want to return to the course selection screen?
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setShowExitConfirm(false)}
              >
                Continue Quiz
              </button>
              <button
                className="modal-btn danger"
                onClick={() => {
                  setShowExitConfirm(false);
                  resetToLanding();
                }}
              >
                Exit to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
