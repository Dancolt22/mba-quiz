// src/components/ChapterSelectionModal.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { COURSES, getCourseById, getAllChapters } from '../data/courses';
import { 
  X, 
  BookOpen, 
  Layers, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  Search, 
  Filter, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  SlidersHorizontal,
  Globe2,
  Rocket,
  Database,
  Users2,
  Briefcase,
  Cpu,
  ChevronRight,
  Check,
  Play
} from 'lucide-react';

const ICON_MAP = {
  Globe2,
  Rocket,
  Database,
  Users2,
  Briefcase,
  Cpu
};

export default function ChapterSelectionModal({ isOpen, onClose }) {
  const {
    selectedCourseIds,
    selectedChapterIds,
    toggleChapter,
    selectAllChaptersForCourse,
    clearChaptersForCourse,
    selectAllChapters,
    modalActiveCourseId,
    setModalActiveCourseId,
    totalQuestionsAvailable,
    startQuiz
  } = useQuiz();

  const [activeCourseFilter, setActiveCourseFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync active course filter if modal was opened with a specific course
  useEffect(() => {
    if (modalActiveCourseId) {
      setActiveCourseFilter(modalActiveCourseId);
    } else {
      setActiveCourseFilter('all');
    }
  }, [modalActiveCourseId, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Selected courses list
  const coursesToDisplay = useMemo(() => {
    if (activeCourseFilter === 'all') {
      return COURSES;
    }
    const found = getCourseById(activeCourseFilter);
    return found ? [found] : COURSES;
  }, [activeCourseFilter]);

  // Total selected chapters count
  const totalSelectedChaptersCount = selectedChapterIds.length;
  const allChaptersList = getAllChapters();

  // Helper to check if all chapters in a course are selected
  const isCourseFullySelected = (course) => {
    const chIds = (course.chapters || []).map(ch => ch.id);
    return chIds.length > 0 && chIds.every(id => selectedChapterIds.includes(id));
  };

  // Helper to check if at least one chapter in a course is selected
  const isCoursePartiallySelected = (course) => {
    const chIds = (course.chapters || []).map(ch => ch.id);
    const selectedCount = chIds.filter(id => selectedChapterIds.includes(id)).length;
    return selectedCount > 0 && selectedCount < chIds.length;
  };

  const handleToggleAllInActive = () => {
    if (activeCourseFilter === 'all') {
      selectAllChapters();
    } else {
      const course = getCourseById(activeCourseFilter);
      if (course) {
        if (isCourseFullySelected(course)) {
          clearChaptersForCourse(course.id);
        } else {
          selectAllChaptersForCourse(course.id);
        }
      }
    }
  };

  return (
    <div className="chapter-modal-backdrop" onClick={onClose}>
      <div className="chapter-modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="chapter-modal-header">
          <div className="modal-title-group">
            <div className="modal-title-icon-wrapper">
              <SlidersHorizontal size={22} className="modal-title-icon" />
            </div>
            <div>
              <h2 className="chapter-modal-title">Chapter & Course Segmentation</h2>
              <p className="chapter-modal-subtitle">
                Isolate and target specific syllabus chapters across MBA courses. Only selected chapters will appear in your quiz session.
              </p>
            </div>
          </div>

          <button className="chapter-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Course Filter Tabs & Search Controls */}
        <div className="chapter-modal-controls">
          <div className="chapter-course-tabs">
            <button
              className={`course-tab-btn ${activeCourseFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCourseFilter('all')}
            >
              <Layers size={15} />
              <span>All Courses</span>
              <span className="tab-count-pill">{totalSelectedChaptersCount}/{allChaptersList.length}</span>
            </button>

            {COURSES.map(c => {
              const selectedCount = (c.chapters || []).filter(ch => selectedChapterIds.includes(ch.id)).length;
              const totalInCourse = (c.chapters || []).length;
              const isSelected = selectedCount > 0;
              const IconComp = ICON_MAP[c.iconName] || Globe2;

              return (
                <button
                  key={c.id}
                  className={`course-tab-btn ${activeCourseFilter === c.id ? 'active' : ''} ${isSelected ? 'has-selection' : ''}`}
                  onClick={() => setActiveCourseFilter(c.id)}
                  style={{ '--tab-color': c.color }}
                >
                  <IconComp size={15} />
                  <span>{c.code}</span>
                  <span className="tab-count-pill">{selectedCount}/{totalInCourse}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter & Search Bar */}
          <div className="chapter-search-and-actions">
            <div className="chapter-search-box">
              <Search size={16} className="chapter-search-icon" />
              <input
                type="text"
                placeholder="Filter chapters by topic, name or keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-mini" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="modal-quick-actions">
              <button 
                className="modal-action-btn select-all" 
                onClick={handleToggleAllInActive}
              >
                <CheckSquare size={14} />
                <span>
                  {activeCourseFilter === 'all' 
                    ? 'Select All Chapters' 
                    : isCourseFullySelected(getCourseById(activeCourseFilter)) 
                      ? 'Deselect Course' 
                      : 'Select All in Course'}
                </span>
              </button>
              <button 
                className="modal-action-btn reset" 
                onClick={selectAllChapters}
              >
                <RotateCcw size={14} />
                <span>Reset All (39 Chs)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Chapters Body */}
        <div className="chapter-modal-body">
          {coursesToDisplay.map(course => {
            const IconComp = ICON_MAP[course.iconName] || Globe2;
            const courseChapters = course.chapters || [];

            // Filter chapters by search query
            const filteredChapters = courseChapters.filter(ch => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase().trim();
              return (
                ch.title.toLowerCase().includes(q) ||
                ch.shortTitle.toLowerCase().includes(q) ||
                ch.description.toLowerCase().includes(q) ||
                (ch.topics || []).some(t => t.toLowerCase().includes(q))
              );
            });

            if (filteredChapters.length === 0 && searchQuery.trim()) {
              return null;
            }

            const courseSelectedCount = courseChapters.filter(ch => selectedChapterIds.includes(ch.id)).length;
            const isFull = courseSelectedCount === courseChapters.length;
            const isNone = courseSelectedCount === 0;

            return (
              <div key={course.id} className="modal-course-block" style={{ '--course-color': course.color }}>
                {/* Course Block Header */}
                <div className="course-block-header">
                  <div className="course-block-left">
                    <div className="course-block-icon" style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                      <IconComp size={18} />
                    </div>
                    <div>
                      <div className="course-block-code-title">
                        <span className="course-block-code">{course.code}</span>
                        <span className="course-block-title">{course.title}</span>
                      </div>
                      <span className="course-block-meta">
                        {courseSelectedCount} of {courseChapters.length} Chapters Active &bull; {course.questionCount} Questions Available
                      </span>
                    </div>
                  </div>

                  <div className="course-block-actions">
                    <button
                      className={`course-select-all-btn ${isFull ? 'all-active' : ''}`}
                      onClick={() => {
                        if (isFull) {
                          clearChaptersForCourse(course.id);
                        } else {
                          selectAllChaptersForCourse(course.id);
                        }
                      }}
                    >
                      {isFull ? <Check size={14} /> : <CheckSquare size={14} />}
                      <span>{isFull ? 'Deselect All' : 'Select All'}</span>
                    </button>
                  </div>
                </div>

                {/* Chapter Cards Grid */}
                <div className="chapter-cards-grid">
                  {filteredChapters.map(chapter => {
                    const isSelected = selectedChapterIds.includes(chapter.id);

                    return (
                      <div
                        key={chapter.id}
                        className={`chapter-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleChapter(chapter.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                      >
                        <div className="chapter-card-header">
                          <span className="chapter-num-badge" style={{ backgroundColor: `${course.color}20`, color: course.color, borderColor: `${course.color}40` }}>
                            Chapter {chapter.number}
                          </span>
                          
                          <div className="chapter-q-badge">
                            <strong>{chapter.questionCount}</strong> Qs
                          </div>

                          <div className={`chapter-checkbox ${isSelected ? 'checked' : ''}`} style={isSelected ? { backgroundColor: course.color, borderColor: course.color } : {}}>
                            {isSelected && <Check size={13} className="chapter-check-icon" />}
                          </div>
                        </div>

                        <h4 className="chapter-card-title">{chapter.title}</h4>
                        <p className="chapter-card-desc">{chapter.description}</p>

                        {chapter.topics && chapter.topics.length > 0 && (
                          <div className="chapter-topics-row">
                            {chapter.topics.map((t, tIdx) => (
                              <span key={tIdx} className="chapter-topic-tag">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Empty search state */}
          {coursesToDisplay.every(c => (c.chapters || []).filter(ch => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase().trim();
            return (
              ch.title.toLowerCase().includes(q) ||
              ch.shortTitle.toLowerCase().includes(q) ||
              ch.description.toLowerCase().includes(q)
            );
          }).length === 0) && (
            <div className="chapter-empty-search">
              <HelpCircle size={32} className="empty-icon" />
              <h3>No Chapters Match "{searchQuery}"</h3>
              <p>Try searching for other terms like PESTEL, Porter, ERP, SQL, Leadership, TQM, EOQ, or CPM.</p>
              <button className="primary-btn" onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
          )}
        </div>

        {/* Modal Sticky Live Footer */}
        <div className="chapter-modal-footer">
          <div className="modal-footer-stats">
            <div className="footer-stat-group">
              <span className="footer-stat-highlight">{totalSelectedChaptersCount} Chapters</span>
              <span className="footer-stat-sep">&bull;</span>
              <span className="footer-stat-text"><strong>{totalQuestionsAvailable}</strong> Questions In Pool</span>
            </div>
            {totalQuestionsAvailable === 0 && (
              <span className="footer-warning-pill">
                Warning: No chapters selected. Please select at least one chapter.
              </span>
            )}
          </div>

          <div className="modal-footer-actions">
            <button className="modal-cancel-btn" onClick={onClose}>
              Back
            </button>
            <button 
              className="modal-apply-btn launch-quiz" 
              onClick={() => {
                onClose();
                startQuiz();
              }}
              disabled={totalQuestionsAvailable === 0}
            >
              <Play size={16} fill="currentColor" />
              <span>Start Quiz ({totalQuestionsAvailable} Qs)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
