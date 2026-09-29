// src/components/ResultsView.jsx
import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Filter, 
  Layers, 
  ArrowLeft, 
  HelpCircle, 
  Bookmark, 
  Printer, 
  Sparkles,
  TrendingUp,
  Search,
  Check,
  X,
  FolderTree
} from 'lucide-react';

export default function ResultsView() {
  const { results, retakeQuiz, resetToLanding } = useQuiz();
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'incorrect' | 'correct' | 'flagged'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBreakdownTab, setActiveBreakdownTab] = useState('courses'); // 'courses' | 'chapters'

  if (!results) {
    return (
      <div className="results-empty">
        <h2>No quiz results available.</h2>
        <button className="primary-btn" onClick={resetToLanding}>Return Home</button>
      </div>
    );
  }

  const {
    score,
    total,
    percentage,
    grade,
    gradeColor,
    timeSpentSeconds,
    courseBreakdown,
    chapterBreakdown = [],
    questions,
    coursesAttempted
  } = results;

  const correctCount = score;
  const incorrectCount = questions.filter(q => q.isAnswered && !q.isCorrect).length;
  const unansweredCount = questions.filter(q => !q.isAnswered).length;
  const flaggedCount = questions.filter(q => q.isFlagged).length;

  // Filtered review questions
  const filteredQuestions = questions.filter(q => {
    let matchesTab = true;
    if (filterMode === 'incorrect') matchesTab = !q.isCorrect;
    else if (filterMode === 'correct') matchesTab = q.isCorrect;
    else if (filterMode === 'flagged') matchesTab = q.isFlagged;

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const qText = (q.question + ' ' + (q.chapterTitle || '') + ' ' + q.topic + ' ' + q.courseTitle + ' ' + q.options.join(' ')).toLowerCase();
      matchesSearch = qText.includes(searchQuery.toLowerCase().trim());
    }

    return matchesTab && matchesSearch;
  });

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="results-view-wrapper">
      {/* Top Banner */}
      <section className="results-hero">
        <div className="results-hero-content">
          <div className="score-circular-badge" style={{ borderColor: gradeColor }}>
            <span className="score-percentage-num">{percentage}%</span>
            <span className="score-raw">{score} / {total}</span>
          </div>

          <div className="results-header-text">
            <div className="grade-badge" style={{ backgroundColor: `${gradeColor}20`, color: gradeColor, borderColor: gradeColor }}>
              <Award size={16} />
              <span>{grade}</span>
            </div>

            <h1 className="results-title">
              {percentage >= 80 ? 'Outstanding Executive Performance!' : percentage >= 50 ? 'Exam Assessment Completed' : 'Needs Further Revision & Practice'}
            </h1>

            <p className="results-desc">
              Assessment completed on {new Date(results.timestamp).toLocaleDateString(undefined, { dateStyle: 'long', timeStyle: 'short' })}. 
              {coursesAttempted && ` Evaluated across ${coursesAttempted.length} MBA course(s).`}
            </p>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="summary-metrics-grid">
          <div className="metric-box correct">
            <CheckCircle2 size={20} className="metric-icon" />
            <div className="metric-data">
              <span className="metric-val">{correctCount}</span>
              <span className="metric-lbl">Correct</span>
            </div>
          </div>

          <div className="metric-box incorrect">
            <XCircle size={20} className="metric-icon" />
            <div className="metric-data">
              <span className="metric-val">{incorrectCount}</span>
              <span className="metric-lbl">Incorrect</span>
            </div>
          </div>

          <div className="metric-box unanswered">
            <HelpCircle size={20} className="metric-icon" />
            <div className="metric-data">
              <span className="metric-val">{unansweredCount}</span>
              <span className="metric-lbl">Unanswered</span>
            </div>
          </div>

          <div className="metric-box time">
            <Clock size={20} className="metric-icon" />
            <div className="metric-data">
              <span className="metric-val">{formatTime(timeSpentSeconds)}</span>
              <span className="metric-lbl">Total Duration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Breakdown Section with Tabs for Courses vs Chapters */}
      <section className="course-performance-section">
        <div className="performance-header-row">
          <h2 className="section-subtitle">
            <TrendingUp size={20} />
            Performance Breakdown
          </h2>

          <div className="breakdown-toggle-tabs">
            <button 
              className={`breakdown-tab-btn ${activeBreakdownTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveBreakdownTab('courses')}
            >
              <Layers size={15} />
              <span>By Course ({courseBreakdown?.length || 0})</span>
            </button>
            <button 
              className={`breakdown-tab-btn ${activeBreakdownTab === 'chapters' ? 'active' : ''}`}
              onClick={() => setActiveBreakdownTab('chapters')}
            >
              <FolderTree size={15} />
              <span>By Chapter ({chapterBreakdown?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* Course Breakdown View */}
        {activeBreakdownTab === 'courses' && courseBreakdown && courseBreakdown.length > 0 && (
          <div className="course-breakdown-grid">
            {courseBreakdown.map(cb => (
              <div key={cb.code} className="course-stat-card">
                <div className="course-stat-top">
                  <div className="stat-code" style={{ color: cb.color }}>{cb.code}</div>
                  <div className="stat-percentage" style={{ color: cb.color }}>{cb.percentage}%</div>
                </div>
                <h4 className="stat-title">{cb.title}</h4>
                <div className="stat-fraction">
                  {cb.correct} of {cb.total} questions correct
                </div>
                <div className="stat-progress-bg">
                  <div 
                    className="stat-progress-bar"
                    style={{ width: `${cb.percentage}%`, backgroundColor: cb.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chapter Breakdown View */}
        {activeBreakdownTab === 'chapters' && (
          <div className="chapter-breakdown-grid">
            {chapterBreakdown.map((ch, chIdx) => {
              const chColor = ch.percentage >= 80 ? '#10B981' : ch.percentage >= 50 ? '#F59E0B' : '#EF4444';

              return (
                <div key={chIdx} className="chapter-stat-card">
                  <div className="chapter-stat-top">
                    <span className="chapter-stat-badge">{ch.courseCode}</span>
                    {ch.number && <span className="chapter-num-tag">Ch {ch.number}</span>}
                    <span className="chapter-stat-score" style={{ color: chColor }}>{ch.percentage}%</span>
                  </div>
                  <h4 className="chapter-stat-title">{ch.title}</h4>
                  <div className="stat-fraction">
                    {ch.correct} of {ch.total} questions correct
                  </div>
                  <div className="stat-progress-bg">
                    <div 
                      className="stat-progress-bar"
                      style={{ width: `${ch.percentage}%`, backgroundColor: chColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Action Buttons Toolbar */}
      <section className="results-action-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn primary" onClick={() => retakeQuiz(false)}>
            <RotateCcw size={16} />
            <span>Retake This Quiz</span>
          </button>

          {incorrectCount > 0 && (
            <button className="toolbar-btn warning" onClick={() => retakeQuiz(true)}>
              <RotateCcw size={16} />
              <span>Retry Missed Questions ({incorrectCount})</span>
            </button>
          )}

          <button className="toolbar-btn secondary" onClick={resetToLanding}>
            <ArrowLeft size={16} />
            <span>Choose Different Courses & Chapters</span>
          </button>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-btn outline" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Report</span>
          </button>
        </div>
      </section>

      {/* Detailed Question Review & Explanations */}
      <section className="review-section">
        <div className="review-header">
          <div className="review-title-group">
            <h2 className="section-subtitle">
              <Layers size={20} />
              Comprehensive Question Review & Explanations
            </h2>
            <p className="section-caption">
              Analyze each question with chapter context, academic rationale and correct answers.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="review-tabs">
            <button
              className={`tab-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All ({total})
            </button>
            <button
              className={`tab-btn incorrect ${filterMode === 'incorrect' ? 'active' : ''}`}
              onClick={() => setFilterMode('incorrect')}
            >
              Incorrect ({incorrectCount})
            </button>
            <button
              className={`tab-btn correct ${filterMode === 'correct' ? 'active' : ''}`}
              onClick={() => setFilterMode('correct')}
            >
              Correct ({correctCount})
            </button>
            {flaggedCount > 0 && (
              <button
                className={`tab-btn flagged ${filterMode === 'flagged' ? 'active' : ''}`}
                onClick={() => setFilterMode('flagged')}
              >
                Flagged ({flaggedCount})
              </button>
            )}
          </div>
        </div>

        {/* Search inside review */}
        <div className="review-search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search within review questions, chapters, topics, or options..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Question Review Cards List */}
        <div className="review-cards-list">
          {filteredQuestions.length === 0 ? (
            <div className="no-filtered-results">
              <p>No questions match your current filter selection.</p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const isSelected = q.selectedAnswer !== undefined;
              const isCorrect = q.isCorrect;

              return (
                <div 
                  key={q.id} 
                  className={`review-card ${isCorrect ? 'card-correct' : isSelected ? 'card-incorrect' : 'card-unanswered'}`}
                >
                  <div className="review-card-top">
                    <div className="review-meta-left">
                      <span className="review-q-num">Q{idx + 1}</span>
                      <span className="review-course-tag">{q.courseCode}</span>
                      {q.chapterNumber && (
                        <span className="review-chapter-tag">
                          Ch {q.chapterNumber}: {q.chapterShortTitle || q.chapterTitle}
                        </span>
                      )}
                      <span className="review-topic-tag">{q.topic}</span>
                    </div>

                    <div className="review-status-badge">
                      {isCorrect ? (
                        <span className="status-badge correct">
                          <CheckCircle2 size={15} /> Correct
                        </span>
                      ) : isSelected ? (
                        <span className="status-badge incorrect">
                          <XCircle size={15} /> Incorrect
                        </span>
                      ) : (
                        <span className="status-badge unanswered">
                          <HelpCircle size={15} /> Unanswered
                        </span>
                      )}

                      {q.isFlagged && (
                        <span className="flag-indicator" title="Flagged during quiz">
                          <Bookmark size={14} fill="currentColor" />
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="review-question-text">{q.question}</h3>

                  {/* Options List */}
                  <div className="review-options-list">
                    {q.options.map((optText, oIdx) => {
                      const optLetter = ['A', 'B', 'C', 'D'][oIdx];
                      const isOptionCorrect = oIdx === q.correctAnswer;
                      const isOptionSelected = q.selectedAnswer === oIdx;

                      let optRowClass = 'review-option-row';
                      if (isOptionCorrect) optRowClass += ' is-correct-answer';
                      if (isOptionSelected && !isOptionCorrect) optRowClass += ' is-user-wrong';

                      return (
                        <div key={oIdx} className={optRowClass}>
                          <span className="review-opt-letter">{optLetter}</span>
                          <span className="review-opt-text">{optText}</span>
                          <div className="review-opt-tag">
                            {isOptionCorrect && (
                              <span className="tag-correct-answer"><Check size={14} /> Correct Answer</span>
                            )}
                            {isOptionSelected && !isOptionCorrect && (
                              <span className="tag-user-choice"><X size={14} /> Your Choice</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Academic Explanation */}
                  <div className="review-explanation-box">
                    <div className="explanation-title-row">
                      <Sparkles size={16} className="exp-icon" />
                      <strong>Academic Rationale & Concept Analysis:</strong>
                    </div>
                    <p className="explanation-body">{q.explanation}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
