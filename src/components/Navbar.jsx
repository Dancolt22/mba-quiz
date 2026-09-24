// src/components/Navbar.jsx
import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { GraduationCap, Sun, Moon, BookOpen, History, Layers, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme, currentView, setCurrentView, historyCount, totalQuestionsBankCount } = useQuiz();

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div 
          className="brand-logo"
          onClick={() => setCurrentView('landing')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-icon-wrapper">
            <GraduationCap className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">MBA Q<span className="brand-highlight">uiz</span></span>
            <span className="brand-subtitle">Executive Assessment</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="nav-links">
          <button
            className={`nav-btn ${currentView === 'landing' ? 'active' : ''}`}
            onClick={() => setCurrentView('landing')}
          >
            <Layers size={16} />
            <span>Courses</span>
          </button>

          <button
            className={`nav-btn ${currentView === 'study-hub' ? 'active' : ''}`}
            onClick={() => setCurrentView('study-hub')}
          >
            <BookOpen size={16} />
            <span>Question Bank</span>
            <span className="badge-count">1,000</span>
          </button>

          <button
            className={`nav-btn ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            <History size={16} />
            <span>My Progress</span>
            {historyCount > 0 && (
              <span className="badge-pill">{historyCount} seen</span>
            )}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Color Theme"
          >
            {theme === 'dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
          </button>
        </div>
      </div>
    </header>
  );
}
