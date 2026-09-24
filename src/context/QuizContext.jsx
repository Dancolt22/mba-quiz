// src/context/QuizContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { COURSES, getCourseById, getAllQuestions, TOTAL_QUESTIONS_COUNT } from '../data/courses';
import { generateQuizSession, saveAnsweredQuestions, saveAttemptResult, getAnsweredQuestionHistory } from '../utils/shuffle';
import confetti from 'canvas-confetti';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mba_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mba_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // View state: 'landing' | 'quiz' | 'results' | 'study-hub' | 'history'
  const [currentView, setCurrentView] = useState('landing');

  // Selected courses (defaults to all courses selected for instant access)
  const [selectedCourseIds, setSelectedCourseIds] = useState(
    COURSES.map(c => c.id)
  );

  // Quiz configuration settings
  const [quizSettings, setQuizSettings] = useState({
    presetCount: 30, // 15, 30, 60, 100, 'all'
    customCount: null,
    mode: 'exam', // 'exam' | 'practice' | 'flashcard'
    timePerQuestion: 60, // seconds per question for exam mode
    shuffleQuestions: true,
    shuffleOptions: true,
    prioritizeUnseen: true
  });

  // Active quiz state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: optionIdx }
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // Results state
  const [results, setResults] = useState(null);

  // History stats
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const hist = getAnsweredQuestionHistory();
    setHistoryCount(hist.size);
  }, [currentView]);

  // Toggle single course selection
  const toggleCourse = (courseId) => {
    setSelectedCourseIds(prev => {
      if (prev.includes(courseId)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const selectAllCourses = () => {
    setSelectedCourseIds(COURSES.map(c => c.id));
  };

  const clearSelectedCourses = () => {
    // Keep first one selected so candidate is never empty
    setSelectedCourseIds([COURSES[0].id]);
  };

  // Start a new quiz
  const startQuiz = (customOverrides = {}) => {
    const config = { ...quizSettings, ...customOverrides };
    const selectedCourses = selectedCourseIds.map(id => getCourseById(id)).filter(Boolean);

    // Calculate total questions available for selected courses
    const maxAvailable = selectedCourses.reduce((acc, c) => acc + c.questionCount, 0);

    let count = config.presetCount === 'all' ? maxAvailable : Number(config.presetCount);
    if (config.customCount) {
      count = Math.min(Math.max(5, Number(config.customCount)), maxAvailable);
    } else {
      count = Math.min(count, maxAvailable);
    }

    const sessionQuestions = generateQuizSession({
      selectedCourses,
      totalQuestionsRequested: count,
      shuffleQuestions: config.shuffleQuestions,
      shuffleOptions: config.shuffleOptions,
      prioritizeUnseen: config.prioritizeUnseen
    });

    setQuestions(sessionQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setStartTime(Date.now());

    // Timer calculation for exam mode
    if (config.mode === 'exam') {
      const totalSeconds = count * config.timePerQuestion;
      setTimeRemaining(totalSeconds);
      setTimerActive(true);
    } else {
      setTimeRemaining(0);
      setTimerActive(false);
    }

    setCurrentView('quiz');
  };

  // Timer tick effect
  useEffect(() => {
    if (!timerActive || currentView !== 'quiz') return;

    if (timeRemaining <= 0) {
      // Auto submit when time expires
      submitQuiz(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, currentView]);

  // Answer a question
  const selectAnswer = (questionId, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Toggle flag on a question
  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const jumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  // Submit quiz and calculate performance analytics
  const submitQuiz = (autoSubmitted = false) => {
    setTimerActive(false);
    const endTime = Date.now();
    const timeSpentSeconds = Math.round(((endTime - (startTime || endTime)) / 1000));

    let correctCount = 0;
    const answeredIds = [];
    const courseBreakdown = {};

    // Initialize course stats
    selectedCourseIds.forEach(id => {
      const course = getCourseById(id);
      if (course) {
        courseBreakdown[course.code] = {
          code: course.code,
          title: course.title,
          color: course.color,
          total: 0,
          correct: 0,
          percentage: 0
        };
      }
    });

    const detailedList = questions.map(q => {
      const selectedIdx = userAnswers[q.id];
      const isAnswered = selectedIdx !== undefined;
      const isCorrect = selectedIdx === q.correctAnswer;

      if (isAnswered) answeredIds.push(q.id);
      if (isCorrect) correctCount++;

      // Track by course
      if (courseBreakdown[q.courseCode]) {
        courseBreakdown[q.courseCode].total += 1;
        if (isCorrect) {
          courseBreakdown[q.courseCode].correct += 1;
        }
      }

      return {
        ...q,
        selectedAnswer: selectedIdx,
        isAnswered,
        isCorrect,
        isFlagged: flaggedQuestions.has(q.id)
      };
    });

    // Calculate course percentages
    Object.values(courseBreakdown).forEach(item => {
      item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    });

    const totalCount = questions.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    let grade = 'Fail';
    let gradeColor = '#EF4444';
    if (percentage >= 80) {
      grade = 'Distinction';
      gradeColor = '#10B981';
    } else if (percentage >= 65) {
      grade = 'Merit';
      gradeColor = '#3B82F6';
    } else if (percentage >= 50) {
      grade = 'Pass';
      gradeColor = '#F59E0B';
    }

    const calculatedResults = {
      score: correctCount,
      total: totalCount,
      percentage,
      grade,
      gradeColor,
      timeSpentSeconds,
      autoSubmitted,
      timestamp: new Date().toISOString(),
      courseBreakdown: Object.values(courseBreakdown),
      questions: detailedList,
      coursesAttempted: selectedCourseIds.map(id => getCourseById(id)?.title).filter(Boolean)
    };

    setResults(calculatedResults);
    saveAnsweredQuestions(answeredIds);
    saveAttemptResult(calculatedResults);

    // Trigger celebratory confetti on good score!
    if (percentage >= 65) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    setCurrentView('results');
  };

  // Retake quiz (all questions or missed questions only)
  const retakeQuiz = (onlyIncorrect = false) => {
    if (!results) return;

    let retakeQuestions = [];
    if (onlyIncorrect) {
      retakeQuestions = results.questions
        .filter(q => !q.isCorrect)
        .map(q => ({
          id: q.id,
          courseCode: q.courseCode,
          courseTitle: q.courseTitle,
          topic: q.topic,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }));
    } else {
      retakeQuestions = results.questions.map(q => ({
        id: q.id,
        courseCode: q.courseCode,
        courseTitle: q.courseTitle,
        topic: q.topic,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }));
    }

    if (retakeQuestions.length === 0) {
      retakeQuestions = questions;
    }

    setQuestions(retakeQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setStartTime(Date.now());

    if (quizSettings.mode === 'exam') {
      const totalSeconds = retakeQuestions.length * quizSettings.timePerQuestion;
      setTimeRemaining(totalSeconds);
      setTimerActive(true);
    } else {
      setTimeRemaining(0);
      setTimerActive(false);
    }

    setCurrentView('quiz');
  };

  const resetToLanding = () => {
    setTimerActive(false);
    setCurrentView('landing');
  };

  return (
    <QuizContext.Provider
      value={{
        theme,
        toggleTheme,
        currentView,
        setCurrentView,
        selectedCourseIds,
        setSelectedCourseIds,
        toggleCourse,
        selectAllCourses,
        clearSelectedCourses,
        quizSettings,
        setQuizSettings,
        startQuiz,
        questions,
        currentIndex,
        currentQuestion: questions[currentIndex] || null,
        userAnswers,
        selectAnswer,
        flaggedQuestions,
        toggleFlag,
        nextQuestion,
        prevQuestion,
        jumpToQuestion,
        timeRemaining,
        submitQuiz,
        results,
        retakeQuiz,
        resetToLanding,
        historyCount,
        totalQuestionsBankCount: TOTAL_QUESTIONS_COUNT
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
