// src/App.jsx
import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import StudyHub from './components/StudyHub';
import HistoryModal from './components/HistoryModal';
import { GraduationCap, Sparkles, BookOpen, Layers } from 'lucide-react';

function AppContent() {
  const { currentView } = useQuiz();

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar />

      {/* Main App Content View */}
      <div className="main-content-wrapper">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'quiz' && <QuizView />}
        {currentView === 'results' && <ResultsView />}
        {currentView === 'study-hub' && <StudyHub />}
        {currentView === 'history' && <HistoryModal />}
      </div>

      {/* Global Executive Footer */}
      {currentView !== 'quiz' && (
        <footer className="app-footer">
          <div className="footer-inner">
            <div className="footer-left">
              <div className="footer-brand">
                <GraduationCap size={18} className="footer-icon" />
                <span>MBA Quiz &bull; Executive Assessment Platform</span>
              </div>
              <p className="footer-caption">
                Comprehensive 1,000 question repository spanning MBA 8101, MBA 8103, MBA 8105, MBA 8107, MBA 8109, and MBA 8111.
              </p>
            </div>
            <div className="footer-right">
              <span className="footer-tag">Fisher-Yates Non-Repeating Shuffling Logic</span>
              <span className="footer-copy">&copy; {new Date().getFullYear()} MBA Quiz. Built for Business School Excellence.</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}
