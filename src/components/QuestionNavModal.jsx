// src/components/QuestionNavModal.jsx
import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { X, CheckCircle2, Bookmark, Circle, HelpCircle } from 'lucide-react';

export default function QuestionNavModal({ isOpen, onClose }) {
  const { questions, currentIndex, jumpToQuestion, userAnswers, flaggedQuestions } = useQuiz();

  if (!isOpen) return null;

  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = flaggedQuestions.size;
  const totalCount = questions.length;
  const unansweredCount = totalCount - answeredCount;

  const handleSelect = (idx) => {
    jumpToQuestion(idx);
    onClose();
  };

  return (
    <div className="nav-modal-backdrop" onClick={onClose}>
      <div className="nav-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="nav-modal-header">
          <div className="nav-modal-title">
            <HelpCircle size={20} className="title-icon" />
            <h3>Question Navigator ({totalCount} Questions)</h3>
          </div>
          <button className="nav-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Legend */}
        <div className="nav-legend-bar">
          <div className="legend-item">
            <span className="legend-dot current"></span>
            <span>Current ({currentIndex + 1})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot answered"></span>
            <span>Answered ({answeredCount})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot flagged"></span>
            <span>Flagged ({flaggedCount})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot unanswered"></span>
            <span>Unanswered ({unansweredCount})</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="nav-grid-container">
          <div className="nav-grid">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = userAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions.has(q.id);

              let itemClass = 'nav-grid-btn';
              if (isCurrent) itemClass += ' current';
              else if (isFlagged) itemClass += ' flagged';
              else if (isAnswered) itemClass += ' answered';
              else itemClass += ' unanswered';

              return (
                <button
                  key={q.id}
                  className={itemClass}
                  onClick={() => handleSelect(idx)}
                >
                  <span className="grid-idx">{idx + 1}</span>
                  {isFlagged && <Bookmark size={10} className="grid-flag-icon" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="nav-modal-footer">
          <button className="nav-close-btn" onClick={onClose}>
            Close Navigator
          </button>
        </div>
      </div>
    </div>
  );
}
