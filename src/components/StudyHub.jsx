// src/components/StudyHub.jsx
import React, { useState, useMemo } from 'react';
import { useQuiz } from '../context/QuizContext';
import { COURSES, getAllQuestions, getCourseById } from '../data/courses';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  ArrowLeft,
  Layers,
  CheckCircle2,
  FolderTree
} from 'lucide-react';

export default function StudyHub() {
  const { setCurrentView } = useQuiz();
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedQuestions, setRevealedQuestions] = useState(new Set());
  const [showAllExplanations, setShowAllExplanations] = useState(false);

  const allQuestions = useMemo(() => getAllQuestions(), []);

  // Available chapters for the selected course filter
  const availableChapters = useMemo(() => {
    if (selectedCourseFilter === 'all') {
      return [];
    }
    const course = getCourseById(selectedCourseFilter);
    return course?.chapters || [];
  }, [selectedCourseFilter]);

  // When course filter changes, reset chapter filter to 'all'
  const handleCourseFilterChange = (courseId) => {
    setSelectedCourseFilter(courseId);
    setSelectedChapterFilter('all');
  };

  // Filter questions
  const filtered = useMemo(() => {
    return allQuestions.filter(q => {
      let matchesCourse = true;
      if (selectedCourseFilter !== 'all') {
        matchesCourse = q.courseCode.toLowerCase().replace(' ', '') === selectedCourseFilter;
      }

      let matchesChapter = true;
      if (selectedChapterFilter !== 'all') {
        matchesChapter = q.chapterId === selectedChapterFilter;
      }

      let matchesSearch = true;
      if (searchQuery.trim()) {
        const full = (q.question + ' ' + (q.chapterTitle || '') + ' ' + q.topic + ' ' + q.courseTitle + ' ' + q.options.join(' ') + ' ' + q.explanation).toLowerCase();
        matchesSearch = full.includes(searchQuery.toLowerCase().trim());
      }

      return matchesCourse && matchesChapter && matchesSearch;
    });
  }, [allQuestions, selectedCourseFilter, selectedChapterFilter, searchQuery]);

  const toggleReveal = (qId) => {
    setRevealedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const toggleAll = () => {
    if (showAllExplanations) {
      setRevealedQuestions(new Set());
      setShowAllExplanations(false);
    } else {
      setRevealedQuestions(new Set(filtered.map(q => q.id)));
      setShowAllExplanations(true);
    }
  };

  return (
    <div className="study-hub-wrapper">
      {/* Header */}
      <section className="study-header">
        <div className="study-header-left">
          <button className="back-home-btn" onClick={() => setCurrentView('landing')}>
            <ArrowLeft size={16} />
            <span>Return to Quiz</span>
          </button>
          <div className="study-title-group">
            <h1 className="study-title">
              <BookOpen size={24} className="title-icon" />
              MBA Question Bank & Study Hub
            </h1>
            <p className="study-desc">
              Browse, search, and study all 1,000 verified MBA questions with chapter isolation and detailed academic explanations across all 6 courses.
            </p>
          </div>
        </div>

        <div className="study-header-right">
          <button className="reveal-all-btn" onClick={toggleAll}>
            {showAllExplanations ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showAllExplanations ? 'Hide All Explanations' : 'Reveal All Answers'}</span>
          </button>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="study-filter-bar">
        {/* Course Filter Pills */}
        <div className="course-filter-pills">
          <button
            className={`pill-filter ${selectedCourseFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleCourseFilterChange('all')}
          >
            All Courses (1,000)
          </button>
          {COURSES.map(c => (
            <button
              key={c.id}
              className={`pill-filter ${selectedCourseFilter === c.id ? 'active' : ''}`}
              onClick={() => handleCourseFilterChange(c.id)}
              style={{ '--course-color': c.color }}
            >
              {c.code}: {c.shortTitle} ({c.questionCount})
            </button>
          ))}
        </div>

        {/* Chapter Sub-filter (when a specific course is selected) */}
        {availableChapters.length > 0 && (
          <div className="chapter-filter-pills">
            <span className="chapter-filter-label">
              <FolderTree size={14} />
              <span>Filter Chapter:</span>
            </span>
            <button
              className={`chapter-pill-btn ${selectedChapterFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedChapterFilter('all')}
            >
              All Chapters ({availableChapters.reduce((acc, ch) => acc + ch.questionCount, 0)})
            </button>
            {availableChapters.map(ch => (
              <button
                key={ch.id}
                className={`chapter-pill-btn ${selectedChapterFilter === ch.id ? 'active' : ''}`}
                onClick={() => setSelectedChapterFilter(ch.id)}
              >
                Ch {ch.number}: {ch.shortTitle} ({ch.questionCount})
              </button>
            ))}
          </div>
        )}

        {/* Search Input */}
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search all 1,000 questions by concept, chapter, topic, framework, keyword, or author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>Clear</button>
          )}
        </div>
      </section>

      {/* Questions Results Count */}
      <div className="results-count-bar">
        <span>Showing <strong>{filtered.length}</strong> of <strong>{allQuestions.length}</strong> questions</span>
      </div>

      {/* Question Cards Grid */}
      <div className="study-questions-list">
        {filtered.length === 0 ? (
          <div className="study-empty-state">
            <p>No questions matched your filter or search query.</p>
          </div>
        ) : (
          filtered.map((q, idx) => {
            const isRevealed = showAllExplanations || revealedQuestions.has(q.id);

            return (
              <div key={q.id} className="study-q-card">
                <div className="study-card-top">
                  <div className="study-meta">
                    <span className="study-q-idx">#{idx + 1}</span>
                    <span className="study-code-tag">{q.courseCode}</span>
                    {q.chapterNumber && (
                      <span className="study-chapter-tag">
                        Ch {q.chapterNumber}: {q.chapterShortTitle || q.chapterTitle}
                      </span>
                    )}
                    <span className="study-topic-tag">{q.topic}</span>
                  </div>

                  <button 
                    className={`study-toggle-ans-btn ${isRevealed ? 'active' : ''}`}
                    onClick={() => toggleReveal(q.id)}
                  >
                    {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                    <span>{isRevealed ? 'Hide Answer' : 'Show Answer'}</span>
                  </button>
                </div>

                <h3 className="study-q-text">{q.question}</h3>

                {/* 4 Options */}
                <div className="study-options-list">
                  {q.options.map((optText, oIdx) => {
                    const optLetter = ['A', 'B', 'C', 'D'][oIdx];
                    const isCorrect = oIdx === q.correctAnswer;

                    let optClass = 'study-option-item';
                    if (isRevealed && isCorrect) optClass += ' is-correct';

                    return (
                      <div key={oIdx} className={optClass}>
                        <span className="opt-letter">{optLetter}</span>
                        <span className="opt-text">{optText}</span>
                        {isRevealed && isCorrect && (
                          <span className="opt-correct-tag">
                            <Check size={14} /> Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isRevealed && (
                  <div className="study-explanation-box">
                    <div className="study-exp-title">
                      <Sparkles size={16} />
                      <strong>Academic Explanation:</strong>
                    </div>
                    <p className="study-exp-content">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
