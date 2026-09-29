// src/components/LandingPage.jsx
import React, { useState } from 'react';
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
  Sparkles, 
  Timer, 
  Award, 
  BookOpen, 
  Shuffle, 
  Play, 
  HelpCircle,
  FolderTree,
  ChevronDown,
  Layers
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
    selectSingleCourse,
    selectAllCourses,
    selectedChapterIds,
    getSelectedChapterCountForCourse,
    totalQuestionsAvailable,
    isChapterModalOpen,
    openChapterModal,
    closeChapterModal,
    quizSettings,
    setQuizSettings,
    startQuiz
  } = useQuiz();

  // Current dropdown value: 'all' or course ID
  const selectedDropdownValue = selectedCourseIds.length === COURSES.length ? 'all' : (selectedCourseIds[0] || 'all');

  const handleCourseChange = (e) => {
    const val = e.target.value;
    if (val === 'all') {
      selectAllCourses();
    } else {
      selectSingleCourse(val);
    }
  };

  const handleStartQuizClick = () => {
    // Open chapter selection modal so user can pick desired chapters before quiz starts
    const courseIdForModal = selectedDropdownValue === 'all' ? null : selectedDropdownValue;
    openChapterModal(courseIdForModal);
  };

  const activeCourse = selectedDropdownValue !== 'all' ? getCourseById(selectedDropdownValue) : null;
  const ActiveIcon = activeCourse ? (ICON_MAP[activeCourse.iconName] || Globe2) : Layers;

  return (
    <div className="relaxed-landing">
      {/* Calm & Minimal Hero Header */}
      <section className="relaxed-hero">
        <div className="hero-badge">
          <Sparkles size={14} className="hero-badge-icon" />
          <span>MBA Executive Exam Platform &bull; 1,000 Questions</span>
        </div>

        <h1 className="relaxed-title">
          Master Your MBA Exams with <span className="gradient-text">Precision</span>
        </h1>

        <p className="relaxed-subtitle">
          Select your course below. Clicking <strong>Start Quiz</strong> will open the chapter selector so you can target specific chapters or attempt the full course.
        </p>
      </section>

      {/* Relaxed Quiz Setup Card */}
      <section className="relaxed-card-container">
        <div className="relaxed-card">
          {/* Step 1: Course Selection via Grouped Dropdown */}
          <div className="relaxed-form-group">
            <label className="relaxed-label" htmlFor="course-select">
              <Layers size={17} className="label-icon" />
              <span>Choose Course</span>
            </label>

            <div className="select-dropdown-wrapper">
              <select
                id="course-select"
                className="relaxed-dropdown"
                value={selectedDropdownValue}
                onChange={handleCourseChange}
              >
                <option value="all">🌟 All 6 Courses (Comprehensive 1,000 Question Pool)</option>
                <optgroup label="MBA Core Courses">
                  {COURSES.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code}: {course.title} ({(course.chapters || []).length} Chapters &bull; {course.questionCount} Qs)
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown size={18} className="dropdown-arrow-icon" />
            </div>

            {/* Selected Course Quick Information Preview */}
            <div className="course-quick-preview">
              <div className="preview-top">
                <div 
                  className="preview-icon-badge" 
                  style={{ 
                    backgroundColor: activeCourse ? `${activeCourse.color}20` : 'rgba(200, 16, 46, 0.15)', 
                    color: activeCourse ? activeCourse.color : 'var(--primary)' 
                  }}
                >
                  <ActiveIcon size={18} />
                </div>
                <div className="preview-titles">
                  <span className="preview-name">
                    {activeCourse ? `${activeCourse.code}: ${activeCourse.title}` : 'All 6 MBA Courses'}
                  </span>
                  <span className="preview-meta">
                    {activeCourse 
                      ? `${(activeCourse.chapters || []).length} Chapters • ${activeCourse.questionCount} Questions` 
                      : '39 Chapters • 1,000 Questions across all courses'}
                  </span>
                </div>
              </div>

              <p className="preview-desc">
                {activeCourse 
                  ? activeCourse.description 
                  : 'Comprehensive question pool covering Business Environment, Entrepreneurship, MIS, Organisational Behaviour, General Management, and Operations Management.'}
              </p>
            </div>
          </div>

          {/* Step 2: Quiz Mode & Configuration Settings */}
          <div className="relaxed-settings-grid">
            {/* Number of Questions */}
            <div className="relaxed-setting-box">
              <label className="relaxed-sublabel">
                <HelpCircle size={15} />
                <span>Question Limit</span>
              </label>
              <div className="relaxed-preset-pills">
                {[15, 30, 60].map(count => (
                  <button
                    key={count}
                    type="button"
                    className={`relaxed-pill ${quizSettings.presetCount === count && !quizSettings.customCount ? 'active' : ''}`}
                    onClick={() => setQuizSettings(prev => ({ ...prev, presetCount: count, customCount: null }))}
                  >
                    {count} Qs
                  </button>
                ))}
                <button
                  type="button"
                  className={`relaxed-pill ${quizSettings.presetCount === 'all' && !quizSettings.customCount ? 'active' : ''}`}
                  onClick={() => setQuizSettings(prev => ({ ...prev, presetCount: 'all', customCount: null }))}
                >
                  All ({totalQuestionsAvailable})
                </button>
              </div>
            </div>

            {/* Exam Mode vs Practice Mode */}
            <div className="relaxed-setting-box">
              <label className="relaxed-sublabel">
                <Timer size={15} />
                <span>Quiz Mode</span>
              </label>
              <div className="relaxed-mode-toggle">
                <button
                  type="button"
                  className={`mode-toggle-btn ${quizSettings.mode === 'exam' ? 'active' : ''}`}
                  onClick={() => setQuizSettings(prev => ({ ...prev, mode: 'exam' }))}
                >
                  <Award size={14} />
                  <span>Timed Exam (60s/Q)</span>
                </button>
                <button
                  type="button"
                  className={`mode-toggle-btn ${quizSettings.mode === 'practice' ? 'active' : ''}`}
                  onClick={() => setQuizSettings(prev => ({ ...prev, mode: 'practice' }))}
                >
                  <BookOpen size={14} />
                  <span>Practice Mode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Shuffling Options */}
          <div className="relaxed-shuffle-row">
            <label className="relaxed-checkbox-label">
              <input
                type="checkbox"
                checked={quizSettings.shuffleQuestions}
                onChange={(e) => setQuizSettings(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
              />
              <span>Shuffle Questions</span>
            </label>
            <label className="relaxed-checkbox-label">
              <input
                type="checkbox"
                checked={quizSettings.shuffleOptions}
                onChange={(e) => setQuizSettings(prev => ({ ...prev, shuffleOptions: e.target.checked }))}
              />
              <span>Shuffle Options</span>
            </label>
          </div>

          {/* Step 3: Start Quiz CTA Button */}
          <div className="relaxed-action-area">
            <button
              className="relaxed-start-btn"
              onClick={handleStartQuizClick}
            >
              <Play size={20} fill="currentColor" />
              <span>Start Quiz</span>
            </button>
            <span className="relaxed-start-hint">
              Opens chapter selector to choose your target chapters before starting
            </span>
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
