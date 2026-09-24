// src/components/LandingPage.jsx
import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { COURSES, getCourseById } from '../data/courses';
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
  BookOpen
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
    quizSettings,
    setQuizSettings,
    startQuiz,
    setCurrentView
  } = useQuiz();

  // Calculate stats for current selection
  const selectedCourses = selectedCourseIds.map(id => getCourseById(id)).filter(Boolean);
  const totalQuestionsAvailable = selectedCourses.reduce((acc, c) => acc + c.questionCount, 0);

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
          <span>MBA Executive Exam Platform &bull; 1,000 Curated Questions</span>
        </div>
        <h1 className="hero-title">
          Master Your MBA Exams with <span className="gradient-text">Precision</span>
        </h1>
        <p className="hero-subtitle">
          Select the courses you want to attempt below. Challenge yourself with realistic, rigorous MBA multiple-choice questions with full academic explanations and robust non-repeating shuffle logic.
        </p>

        {/* Highlight Stats Strip */}
        <div className="hero-stats-strip">
          <div className="stat-card">
            <span className="stat-num">6</span>
            <span className="stat-label">Core Courses</span>
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
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-num">0%</span>
            <span className="stat-label">Question Repetitions</span>
          </div>
        </div>
      </section>

      {/* Main Course Selector Section */}
      <section className="course-selection-section">
        <div className="section-header">
          <div className="section-title-group">
            <h2 className="section-title">
              <Layers size={22} className="section-title-icon" />
              Select Courses to Attempt
            </h2>
            <p className="section-desc">
              Choose one or multiple courses. Questions are sampled equally across your selections.
            </p>
          </div>

          <div className="selection-quick-actions">
            <button
              className={`action-pill ${isAllSelected ? 'active' : ''}`}
              onClick={selectAllCourses}
            >
              <CheckSquare size={15} />
              <span>Select All (6 Courses)</span>
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
                {selectedCourseIds.length} {selectedCourseIds.length === 1 ? 'Course' : 'Courses'} Selected
              </span>
              <span className="summary-sub">
                {quizSettings.presetCount === 'all' ? totalQuestionsAvailable : quizSettings.presetCount} questions will be drawn equally with Fisher-Yates non-repeating shuffle.
              </span>
            </div>

            <button
              className="launch-quiz-btn"
              onClick={handleStart}
              disabled={selectedCourseIds.length === 0}
            >
              <Play size={20} fill="currentColor" />
              <span>Begin MBA Quiz</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
