// src/components/LandingPage.jsx
import React, { useState, useMemo } from 'react';
import { useQuiz } from '../context/QuizContext';
import { COURSES, getCourseById } from '../data/courses';
import { 
  Globe2, 
  Rocket, 
  Database, 
  Users2, 
  Briefcase, 
  Cpu, 
  Sparkles, 
  Timer, 
  Award, 
  BookOpen, 
  Play, 
  HelpCircle, 
  Layers, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  Search, 
  X, 
  RotateCcw, 
  SlidersHorizontal,
  ChevronRight,
  Filter
} from 'lucide-react';

const ICON_MAP = {
  Globe2,
  Rocket,
  Database,
  Users2,
  Briefcase,
  Cpu
};

export default function LandingPage() {
  const {
    selectedCourseIds,
    toggleCourse,
    selectAllCourses,
    deselectAllCourses,
    selectedChapterIds,
    toggleChapter,
    selectAllChaptersForCourse,
    clearChaptersForCourse,
    selectAllChapters,
    deselectAllChapters,
    getSelectedChapterCountForCourse,
    totalQuestionsAvailable,
    quizSettings,
    setQuizSettings,
    startQuiz
  } = useQuiz();

  // Workflow step: 'courses' (Step 1) | 'chapters' (Step 2)
  const [currentStep, setCurrentStep] = useState('courses');
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');

  // Selected course objects based on Step 1 selection
  const activeSelectedCourses = useMemo(() => {
    return COURSES.filter(c => selectedCourseIds.includes(c.id));
  }, [selectedCourseIds]);

  // Check if all 6 courses are selected
  const isAllCoursesSelected = selectedCourseIds.length === COURSES.length;

  // Selected chapters count for active courses
  const totalSelectedChaptersCount = selectedChapterIds.length;

  // Question count to display on Start Quiz button
  const effectiveQuestionCount = useMemo(() => {
    if (quizSettings.presetCount === 'all') {
      return totalQuestionsAvailable;
    }
    return Math.min(Number(quizSettings.presetCount) || 30, totalQuestionsAvailable);
  }, [quizSettings.presetCount, totalQuestionsAvailable]);

  // Handler to move from Step 1 to Step 2
  const handleProceedToChapters = () => {
    if (selectedCourseIds.length === 0) return;
    setCurrentStep('chapters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to go back from Step 2 to Step 1
  const handleBackToCourses = () => {
    setCurrentStep('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for Start Quiz button
  const handleStartQuiz = () => {
    if (totalQuestionsAvailable === 0) return;
    startQuiz();
  };

  return (
    <div className="flow-landing-container">
      {/* Step Progress Navigation Bar */}
      <nav className="workflow-stepper" aria-label="Assessment Setup Steps">
        <button 
          className={`step-indicator-btn ${currentStep === 'courses' ? 'active' : 'completed'}`}
          onClick={() => setCurrentStep('courses')}
        >
          <div className="step-num-badge">
            {currentStep === 'chapters' && selectedCourseIds.length > 0 ? (
              <Check size={14} className="step-check-icon" />
            ) : (
              '1'
            )}
          </div>
          <div className="step-label-group">
            <span className="step-tag">Step 1</span>
            <span className="step-title">Select Courses</span>
          </div>
        </button>

        <div className={`step-connector-line ${currentStep === 'chapters' ? 'filled' : ''}`} />

        <button 
          className={`step-indicator-btn ${currentStep === 'chapters' ? 'active' : ''}`}
          onClick={() => {
            if (selectedCourseIds.length > 0) setCurrentStep('chapters');
          }}
          disabled={selectedCourseIds.length === 0}
        >
          <div className="step-num-badge">2</div>
          <div className="step-label-group">
            <span className="step-tag">Step 2</span>
            <span className="step-title">Select Chapters</span>
          </div>
        </button>
      </nav>

      {/* =========================================================================
          STEP 1: COURSE SELECTION PAGE (Simple Checkbox Selectors)
          ========================================================================= */}
      {currentStep === 'courses' && (
        <section className="step-content-section animate-fade-in" aria-labelledby="step1-heading">
          {/* Header */}
          <div className="step-hero-header">
            <div className="hero-badge">
              <Sparkles size={14} className="hero-badge-icon" />
              <span>MBA Executive Assessment &bull; 1,000 Questions</span>
            </div>

            <h1 id="step1-heading" className="step-hero-title">
              Choose Your <span className="gradient-text">Courses</span>
            </h1>

            <p className="step-hero-subtitle">
              Select the course materials you wish to include. In the next step, you can pick specific chapters you are ready to be tested on.
            </p>
          </div>

          {/* Quick Select All / Clear Toolbar */}
          <div className="course-toolbar">
            <div className="toolbar-left">
              <span className="toolbar-status-badge">
                <strong>{selectedCourseIds.length}</strong> of {COURSES.length} Courses Selected
              </span>
              <span className="toolbar-sub-status">
                ({selectedChapterIds.length} Chapters &bull; {totalQuestionsAvailable} Questions in Pool)
              </span>
            </div>

            <div className="toolbar-actions">
              <button
                type="button"
                className={`toolbar-action-btn ${isAllCoursesSelected ? 'active-tone' : ''}`}
                onClick={selectAllCourses}
              >
                <CheckSquare size={15} />
                <span>Select All Courses</span>
              </button>
              {selectedCourseIds.length > 0 && (
                <button
                  type="button"
                  className="toolbar-action-btn subtle"
                  onClick={deselectAllCourses}
                >
                  <Square size={15} />
                  <span>Clear Selection</span>
                </button>
              )}
            </div>
          </div>

          {/* Course Selection Checkbox Grid */}
          <div className="course-checkbox-grid">
            {COURSES.map(course => {
              const isSelected = selectedCourseIds.includes(course.id);
              const IconComp = ICON_MAP[course.iconName] || Layers;
              const chapterCount = (course.chapters || []).length;

              return (
                <div
                  key={course.id}
                  className={`course-select-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleCourse(course.id)}
                  style={{ '--course-accent': course.color }}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleCourse(course.id);
                    }
                  }}
                >
                  {/* Card Top Row: Checkbox + Icon + Code */}
                  <div className="card-top-row">
                    <div className="course-badge-with-icon">
                      <div 
                        className="course-icon-badge" 
                        style={{ backgroundColor: `${course.color}20`, color: course.color }}
                      >
                        <IconComp size={18} />
                      </div>
                      <div className="course-code-tag" style={{ color: course.color, borderColor: `${course.color}40`, backgroundColor: `${course.color}10` }}>
                        {course.code}
                      </div>
                    </div>

                    {/* Custom Checkbox Selector */}
                    <div 
                      className={`custom-checkbox ${isSelected ? 'checked' : ''}`}
                      style={isSelected ? { backgroundColor: course.color, borderColor: course.color } : {}}
                    >
                      {isSelected && <Check size={14} className="checkbox-check" />}
                    </div>
                  </div>

                  {/* Course Title & Overview */}
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-desc">{course.description}</p>

                  {/* Course Bottom Stats */}
                  <div className="course-card-footer">
                    <span className="card-metric-pill">
                      <strong>{chapterCount}</strong> Chapters
                    </span>
                    <span className="card-metric-dot">&bull;</span>
                    <span className="card-metric-pill">
                      <strong>{course.questionCount}</strong> Questions
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Step 1 Action Bar */}
          <div className="step-bottom-bar">
            <div className="bar-info">
              {selectedCourseIds.length === 0 ? (
                <span className="bar-warning-text">
                  Please select at least one course to continue.
                </span>
              ) : (
                <div className="bar-selection-summary">
                  <span className="bar-selected-count">
                    {selectedCourseIds.length} {selectedCourseIds.length === 1 ? 'Course' : 'Courses'} Selected
                  </span>
                  <span className="bar-sep">&bull;</span>
                  <span className="bar-subtext">
                    {selectedChapterIds.length} Chapters ({totalQuestionsAvailable} Qs)
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              className="primary-action-btn next-step-btn"
              disabled={selectedCourseIds.length === 0}
              onClick={handleProceedToChapters}
            >
              <span>Next: Choose Chapters</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          STEP 2: CHAPTER SELECTION PAGE (Based on Selected Course Material)
          ========================================================================= */}
      {currentStep === 'chapters' && (
        <section className="step-content-section animate-fade-in" aria-labelledby="step2-heading">
          {/* Top Back Nav & Header */}
          <div className="step-header-with-back">
            <button 
              type="button"
              className="back-link-btn"
              onClick={handleBackToCourses}
            >
              <ArrowLeft size={16} />
              <span>Back to Course Selection</span>
            </button>

            <div className="step-hero-header compact">
              <h1 id="step2-heading" className="step-hero-title">
                Select Your <span className="gradient-text">Chapters</span>
              </h1>
              <p className="step-hero-subtitle">
                Customize your quiz by adding only the chapters you feel ready to be tested on. Questions will be generated exclusively from your chosen topics.
              </p>
            </div>
          </div>

          {/* Search & Global Actions Bar */}
          <div className="chapter-control-toolbar">
            <div className="chapter-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search chapters by title, topic, or keyword (e.g. PESTEL, Porter, SQL, Agile)..."
                value={chapterSearchQuery}
                onChange={e => setChapterSearchQuery(e.target.value)}
              />
              {chapterSearchQuery && (
                <button 
                  type="button" 
                  className="clear-search-btn" 
                  onClick={() => setChapterSearchQuery('')}
                  aria-label="Clear Search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="chapter-global-actions">
              <button
                type="button"
                className="toolbar-action-btn"
                onClick={selectAllChapters}
              >
                <CheckSquare size={14} />
                <span>Select All Chapters</span>
              </button>
              <button
                type="button"
                className="toolbar-action-btn subtle"
                onClick={deselectAllChapters}
              >
                <Square size={14} />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Chapter Blocks Grouped by Selected Courses */}
          <div className="course-chapters-container">
            {activeSelectedCourses.map(course => {
              const IconComp = ICON_MAP[course.iconName] || Layers;
              const courseChapters = course.chapters || [];

              // Filter chapters by search query
              const filteredChapters = courseChapters.filter(ch => {
                if (!chapterSearchQuery.trim()) return true;
                const q = chapterSearchQuery.toLowerCase().trim();
                return (
                  ch.title.toLowerCase().includes(q) ||
                  ch.shortTitle.toLowerCase().includes(q) ||
                  ch.description.toLowerCase().includes(q) ||
                  (ch.topics || []).some(t => t.toLowerCase().includes(q))
                );
              });

              if (filteredChapters.length === 0 && chapterSearchQuery.trim()) {
                return null;
              }

              const selectedInThisCourse = courseChapters.filter(ch => selectedChapterIds.includes(ch.id)).length;
              const isAllInCourseSelected = selectedInThisCourse === courseChapters.length && courseChapters.length > 0;

              return (
                <div 
                  key={course.id} 
                  className="course-chapter-group-card"
                  style={{ '--course-accent': course.color }}
                >
                  {/* Course Group Header */}
                  <div className="group-header">
                    <div className="group-header-left">
                      <div 
                        className="group-icon-badge" 
                        style={{ backgroundColor: `${course.color}20`, color: course.color }}
                      >
                        <IconComp size={18} />
                      </div>
                      <div>
                        <div className="group-title-row">
                          <span className="group-course-code" style={{ color: course.color }}>{course.code}</span>
                          <span className="group-course-title">{course.title}</span>
                        </div>
                        <span className="group-course-meta">
                          {selectedInThisCourse} of {courseChapters.length} Chapters Active &bull; {course.questionCount} Questions
                        </span>
                      </div>
                    </div>

                    <div className="group-header-right">
                      <button
                        type="button"
                        className={`group-select-toggle-btn ${isAllInCourseSelected ? 'all-active' : ''}`}
                        onClick={() => {
                          if (isAllInCourseSelected) {
                            clearChaptersForCourse(course.id);
                          } else {
                            selectAllChaptersForCourse(course.id);
                          }
                        }}
                      >
                        {isAllInCourseSelected ? <Check size={13} /> : <CheckSquare size={13} />}
                        <span>{isAllInCourseSelected ? 'Deselect Course' : 'Select All in Course'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Chapter Checkbox Cards Grid */}
                  <div className="chapter-checkbox-grid">
                    {filteredChapters.map(chapter => {
                      const isSelected = selectedChapterIds.includes(chapter.id);

                      return (
                        <div
                          key={chapter.id}
                          className={`chapter-select-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleChapter(chapter.id)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onKeyDown={e => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              toggleChapter(chapter.id);
                            }
                          }}
                        >
                          <div className="chapter-card-top">
                            <div className="chapter-num-badge" style={{ backgroundColor: `${course.color}18`, color: course.color, borderColor: `${course.color}35` }}>
                              Chapter {chapter.number}
                            </div>

                            <div className="chapter-q-count">
                              <strong>{chapter.questionCount}</strong> Qs
                            </div>

                            <div 
                              className={`custom-checkbox mini ${isSelected ? 'checked' : ''}`}
                              style={isSelected ? { backgroundColor: course.color, borderColor: course.color } : {}}
                            >
                              {isSelected && <Check size={12} className="checkbox-check" />}
                            </div>
                          </div>

                          <h4 className="chapter-item-title">{chapter.title}</h4>
                          <p className="chapter-item-desc">{chapter.description}</p>

                          {chapter.topics && chapter.topics.length > 0 && (
                            <div className="chapter-topic-pills">
                              {chapter.topics.map((topic, tIdx) => (
                                <span key={tIdx} className="topic-pill">
                                  {topic}
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
            {activeSelectedCourses.every(c => (c.chapters || []).filter(ch => {
              if (!chapterSearchQuery.trim()) return true;
              const q = chapterSearchQuery.toLowerCase().trim();
              return (
                ch.title.toLowerCase().includes(q) ||
                ch.shortTitle.toLowerCase().includes(q) ||
                ch.description.toLowerCase().includes(q) ||
                (ch.topics || []).some(t => t.toLowerCase().includes(q))
              );
            }).length === 0) && (
              <div className="empty-search-alert">
                <HelpCircle size={32} className="empty-icon" />
                <h3>No Chapters Match "{chapterSearchQuery}"</h3>
                <p>Try searching for terms like PESTEL, Porter, ERP, SQL, Leadership, TQM, or EOQ.</p>
                <button 
                  type="button" 
                  className="toolbar-action-btn active-tone" 
                  onClick={() => setChapterSearchQuery('')}
                >
                  Clear Search Filter
                </button>
              </div>
            )}
          </div>

          {/* Quiz Configuration & Presets Card */}
          <div className="quiz-options-card">
            <div className="options-header">
              <SlidersHorizontal size={17} className="options-header-icon" />
              <span>Quiz Settings</span>
            </div>

            <div className="options-grid">
              {/* Question Limit Selection */}
              <div className="option-col">
                <label className="option-label">
                  <HelpCircle size={14} />
                  <span>Question Limit</span>
                </label>
                <div className="preset-pills-row">
                  {[15, 30, 60].map(count => (
                    <button
                      key={count}
                      type="button"
                      className={`preset-pill ${quizSettings.presetCount === count && !quizSettings.customCount ? 'active' : ''}`}
                      onClick={() => setQuizSettings(prev => ({ ...prev, presetCount: count, customCount: null }))}
                    >
                      {count} Qs
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`preset-pill ${quizSettings.presetCount === 'all' && !quizSettings.customCount ? 'active' : ''}`}
                    onClick={() => setQuizSettings(prev => ({ ...prev, presetCount: 'all', customCount: null }))}
                  >
                    All ({totalQuestionsAvailable})
                  </button>
                </div>
              </div>

              {/* Exam vs Practice Mode Toggle */}
              <div className="option-col">
                <label className="option-label">
                  <Timer size={14} />
                  <span>Quiz Mode</span>
                </label>
                <div className="mode-toggle-group">
                  <button
                    type="button"
                    className={`mode-btn ${quizSettings.mode === 'exam' ? 'active' : ''}`}
                    onClick={() => setQuizSettings(prev => ({ ...prev, mode: 'exam' }))}
                  >
                    <Award size={14} />
                    <span>Timed Exam (60s/Q)</span>
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${quizSettings.mode === 'practice' ? 'active' : ''}`}
                    onClick={() => setQuizSettings(prev => ({ ...prev, mode: 'practice' }))}
                  >
                    <BookOpen size={14} />
                    <span>Practice Mode</span>
                  </button>
                </div>
              </div>

              {/* Shuffling Options */}
              <div className="option-col shuffle-options-col">
                <label className="option-label">
                  <span>Randomization</span>
                </label>
                <div className="shuffle-checkboxes-row">
                  <label className="checkbox-toggle-label">
                    <input
                      type="checkbox"
                      checked={quizSettings.shuffleQuestions}
                      onChange={e => setQuizSettings(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                    />
                    <span>Shuffle Questions</span>
                  </label>
                  <label className="checkbox-toggle-label">
                    <input
                      type="checkbox"
                      checked={quizSettings.shuffleOptions}
                      onChange={e => setQuizSettings(prev => ({ ...prev, shuffleOptions: e.target.checked }))}
                    />
                    <span>Shuffle Options</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Step 2 Action Bar: Next becomes Start Quiz */}
          <div className="step-bottom-bar sticky-footer">
            <div className="bar-info">
              {totalQuestionsAvailable === 0 ? (
                <span className="bar-warning-text">
                  No chapters selected. Please select at least one chapter to start.
                </span>
              ) : (
                <div className="bar-selection-summary">
                  <span className="bar-selected-count">
                    {totalSelectedChaptersCount} Chapters Selected
                  </span>
                  <span className="bar-sep">&bull;</span>
                  <span className="bar-subtext">
                    <strong>{totalQuestionsAvailable}</strong> Questions Available in Pool
                  </span>
                </div>
              )}
            </div>

            <div className="bar-buttons-group">
              <button
                type="button"
                className="secondary-action-btn"
                onClick={handleBackToCourses}
              >
                <ArrowLeft size={16} />
                <span>Back to Courses</span>
              </button>

              <button
                type="button"
                className="primary-action-btn start-quiz-btn"
                disabled={totalQuestionsAvailable === 0}
                onClick={handleStartQuiz}
              >
                <Play size={18} fill="currentColor" />
                <span>Start Quiz ({effectiveQuestionCount} Qs)</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
