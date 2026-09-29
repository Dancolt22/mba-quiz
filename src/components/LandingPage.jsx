// src/components/LandingPage.jsx
import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { COURSES, getCourseById } from '../data/courses';
import ChapterSelectionModal from './ChapterSelectionModal';
import { 
  Globe2, 
  Rocket, 
  Database, 
  Users2, 
  Briefcase, 
  Cpu, 
  CheckCircle2, 
  Circle, 
  Shuffle, 
  Timer, 
  Sparkles, 
  CheckSquare, 
  Layers, 
  Play, 
  HelpCircle,
  Award,
  BookOpen,
  SlidersHorizontal,
  FolderTree
} from 'lucide-react';

// Icon mapper helper
const ICON_MAP = {
  Globe2: Globe2,
  Rocket: Rocket,
  Database: Database,
  Users2: Users2,
  Briefcase: Briefcase,
  Cpu: Cpu
};

export default function LandingPage() {
  const {
    selectedCourseIds,
    toggleCourse,
    selectAllCourses,
    clearSelectedCourses,
    selectedChapterIds,
    getSelectedChapterCountForCourse,
    totalQuestionsAvailable,
    isChapterModalOpen,
    openChapterModal,
    closeChapterModal,
    quizSettings,
    setQuizSettings,
    startQuiz,
    setCurrentView
  } = useQuiz();

  const isAllSelected = selectedCourseIds.length === COURSES.length;

  const handleStart = () => {
    startQuiz();
  };

  return (
    <div className="landing-page">
      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} className="hero-badge-icon" />
          <span>MBA Executive Exam Platform &bull; 1,000 Curated Questions &bull; Chapter Isolation</span>
        </div>
        <h1 className="hero-title">
          Master Your MBA Exams with <span className="gradient-text">Precision</span>
        </h1>
        <p className="hero-subtitle">
          Select courses and isolate syllabus chapters below. Challenge yourself with rigorous MBA multiple-choice questions, granular chapter targeting, verified explanations, and non-repeating shuffle logic.
        </p>

        {/* Highlight Stats Strip */}
        <div className="hero-stats-strip">
          <div className="stat-card">
            <span className="stat-num">6</span>
            <span className="stat-label">Core Courses</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-num">39</span>
            <span className="stat-label">Segmented Chapters</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-num">1,000</span>
            <span className="stat-label">Total Questions</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-num">100%</span>
            <span className="stat-label">Verified Answers & Explanations</span>
          </div>
        </div>
      </section>

      {/* Main Course Selector Section */}
      <section className="course-selection-section">
        <div className="section-header">
          <div className="section-title-group">
            <h2 className="section-title">
              <Layers size={22} className="section-title-icon" />
              Select Courses & Chapters
            </h2>
            <p className="section-desc">
              Choose one or multiple courses. Click "Segment by Chapters" or the chapter badge on any card to isolate specific syllabus units.
            </p>
          </div>

          <div className="selection-quick-actions">
            <button
              className="action-pill chapter-action active"
              onClick={() => openChapterModal(null)}
              title="Segment and customize individual chapters"
            >
              <SlidersHorizontal size={15} />
              <span>Segment Chapters ({selectedChapterIds.length}/39)</span>
            </button>
            <button
              className={`action-pill ${isAllSelected ? 'active' : ''}`}
              onClick={selectAllCourses}
            >
              <CheckSquare size={15} />
              <span>Select All Courses</span>
            </button>
            <button
              className="action-pill outline"
              onClick={clearSelectedCourses}
            >
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 6 Course Cards Grid */}
        <div className="courses-grid">
          {COURSES.map((course) => {
            const isSelected = selectedCourseIds.includes(course.id);
            const IconComponent = ICON_MAP[course.iconName] || Globe2;
            const totalCourseChapters = (course.chapters || []).length;
            const activeCourseChapters = getSelectedChapterCountForCourse(course.id);

            return (
              <div
                key={course.id}
                className={`course-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleCourse(course.id)}
                role="button"
                tabIndex={0}
                style={{ '--course-color': course.color }}
              >
                <div className="course-card-top">
                  <div className="course-icon-badge" style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                    <IconComponent size={24} />
                  </div>
                  <div className="course-code-tag" style={{ borderColor: `${course.color}40`, color: course.color }}>
                    {course.code}
                  </div>
                  <div className="course-check">
                    {isSelected ? (
                      <CheckCircle2 size={22} className="check-icon checked" style={{ color: course.color }} />
                    ) : (
                      <Circle size={22} className="check-icon unchecked" />
                    )}
                  </div>
                </div>

                <div className="course-card-content">
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-desc">{course.description}</p>
                </div>

                <div className="course-card-footer">
                  <div className="course-q-count">
                    <span className="count-num">{course.questionCount}</span> Questions
                  </div>

                  {/* Clickable Chapter Segmenter Trigger */}
                  <button
                    className={`card-chapter-segment-btn ${activeCourseChapters > 0 ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openChapterModal(course.id);
                    }}
                    title={`Customize chapters for ${course.code}`}
                  >
                    <FolderTree size={13} />
                    <span>{activeCourseChapters}/{totalCourseChapters} Chs</span>
                  </button>

                  <span className="course-status-label">
                    {isSelected ? 'Selected' : 'Click to add'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quiz Configuration Drawer / Bar */}
      <section className="config-section">
        <div className="config-card">
          <div className="config-grid">
            {/* Number of Questions */}
            <div className="config-group">
              <label className="config-label">
                <HelpCircle size={16} />
                <span>Question Count</span>
              </label>
              <div className="preset-buttons">
                {[15, 30, 60, 100].map(count => (
                  <button
                    key={count}
                    className={`preset-btn ${quizSettings.presetCount === count && !quizSettings.customCount ? 'active' : ''}`}
                    onClick={() => setQuizSettings(prev => ({ ...prev, presetCount: count, customCount: null }))}
                  >
                    {count} Qs
                  </button>
                ))}
                <button
                  className={`preset-btn ${quizSettings.presetCount === 'all' && !quizSettings.customCount ? 'active' : ''}`}
                  onClick={() => setQuizSettings(prev => ({ ...prev, presetCount: 'all', customCount: null }))}
                >
                  All ({totalQuestionsAvailable})
                </button>
              </div>
            </div>

            {/* Test Mode */}
            <div className="config-group">
              <label className="config-label">
                <Timer size={16} />
                <span>Quiz Mode</span>
              </label>
              <div className="mode-toggle-group">
                <button
                  className={`mode-btn ${quizSettings.mode === 'exam' ? 'active' : ''}`}
                  onClick={() => setQuizSettings(prev => ({ ...prev, mode: 'exam' }))}
                >
                  <Award size={15} />
                  <span>Timed Exam (60s / Q)</span>
                </button>
                <button
                  className={`mode-btn ${quizSettings.mode === 'practice' ? 'active' : ''}`}
                  onClick={() => setQuizSettings(prev => ({ ...prev, mode: 'practice' }))}
                >
                  <BookOpen size={15} />
                  <span>Practice (Instant Answers)</span>
                </button>
              </div>
            </div>

            {/* Shuffling Options */}
            <div className="config-group">
              <label className="config-label">
                <Shuffle size={16} />
                <span>Shuffle Logic</span>
              </label>
              <div className="checkbox-options">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={quizSettings.shuffleQuestions}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                  />
                  <span>Shuffle Questions</span>
                </label>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={quizSettings.shuffleOptions}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, shuffleOptions: e.target.checked }))}
                  />
                  <span>Shuffle Choices</span>
                </label>
              </div>
            </div>
          </div>

          {/* Launch Action Bar */}
          <div className="launch-action-bar">
            <div className="launch-summary">
              <span className="summary-main">
                {selectedCourseIds.length} {selectedCourseIds.length === 1 ? 'Course' : 'Courses'} &bull; {selectedChapterIds.length} Chapters Active
              </span>
              <span className="summary-sub">
                {quizSettings.presetCount === 'all' ? totalQuestionsAvailable : Math.min(quizSettings.presetCount, totalQuestionsAvailable)} questions sampled equally across active chapters using Fisher-Yates non-repeating logic.
              </span>
            </div>

            <button
              className="launch-quiz-btn"
              onClick={handleStart}
              disabled={selectedCourseIds.length === 0 || totalQuestionsAvailable === 0}
            >
              <Play size={20} fill="currentColor" />
              <span>Begin MBA Quiz</span>
            </button>
          </div>
        </div>
      </section>

      {/* Chapter Selection Modal */}
      <ChapterSelectionModal
        isOpen={isChapterModalOpen}
        onClose={closeChapterModal}
      />
    </div>
  );
}
