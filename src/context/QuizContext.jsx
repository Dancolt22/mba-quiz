// src/context/QuizContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { COURSES, getCourseById, getAllQuestions, getAllChapters, getChapterById, TOTAL_QUESTIONS_COUNT } from '../data/courses';
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

  // Selected chapter IDs (defaults to all chapters across all courses)
  const [selectedChapterIds, setSelectedChapterIds] = useState(
    getAllChapters().map(ch => ch.id)
  );

  // Chapter Modal state
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [modalActiveCourseId, setModalActiveCourseId] = useState(null); // null means 'all'

  const openChapterModal = (courseId = null) => {
    setModalActiveCourseId(courseId);
    setIsChapterModalOpen(true);
  };

  const closeChapterModal = () => {
    setIsChapterModalOpen(false);
  };

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
    const course = getCourseById(courseId);
    const courseChapterIds = (course?.chapters || []).map(ch => ch.id);

    setSelectedCourseIds(prev => {
      if (prev.includes(courseId)) {
        const nextCourses = prev.filter(id => id !== courseId);
        // Remove this course's chapters
        setSelectedChapterIds(prevCh => prevCh.filter(id => !courseChapterIds.includes(id)));
        return nextCourses;
      } else {
        const nextCourses = [...prev, courseId];
        // Add all chapters of this newly enabled course
        setSelectedChapterIds(prevCh => Array.from(new Set([...prevCh, ...courseChapterIds])));
        return nextCourses;
      }
    });
  };

  const selectAllCourses = () => {
    setSelectedCourseIds(COURSES.map(c => c.id));
    setSelectedChapterIds(getAllChapters().map(ch => ch.id));
  };

  const deselectAllCourses = () => {
    setSelectedCourseIds([]);
    setSelectedChapterIds([]);
  };

  const selectSingleCourse = (courseId) => {
    if (courseId === 'all') {
      selectAllCourses();
      return;
    }
    const course = getCourseById(courseId);
    if (!course) return;
    setSelectedCourseIds([course.id]);
    setSelectedChapterIds((course.chapters || []).map(ch => ch.id));
  };

  const clearSelectedCourses = () => {
    deselectAllCourses();
  };

  // Chapter selection handlers
  const toggleChapter = (chapterId) => {
    const chInfo = getChapterById(chapterId);
    if (!chInfo) return;

    setSelectedChapterIds(prev => {
      let next;
      if (prev.includes(chapterId)) {
        next = prev.filter(id => id !== chapterId);
      } else {
        next = [...prev, chapterId];
        // Ensure parent course is selected
        if (!selectedCourseIds.includes(chInfo.courseId)) {
          setSelectedCourseIds(prevC => [...prevC, chInfo.courseId]);
        }
      }
      return next;
    });
  };

  const deselectAllChapters = () => {
    setSelectedChapterIds([]);
  };

  const selectAllChaptersForCourse = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return;
    const courseChapterIds = (course.chapters || []).map(ch => ch.id);

    // Ensure course is in selected courses
    if (!selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(prev => [...prev, courseId]);
    }

    setSelectedChapterIds(prev => Array.from(new Set([...prev, ...courseChapterIds])));
  };

  const clearChaptersForCourse = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return;
    const courseChapterIds = (course.chapters || []).map(ch => ch.id);

    setSelectedChapterIds(prev => prev.filter(id => !courseChapterIds.includes(id)));
  };

  const selectAllChapters = () => {
    selectAllCourses();
  };

  const isChapterSelected = (chapterId) => {
    return selectedChapterIds.includes(chapterId);
  };

  const getSelectedChapterCountForCourse = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return 0;
    return (course.chapters || []).filter(ch => selectedChapterIds.includes(ch.id)).length;
  };

  // Dynamically compute available questions based on active course & chapter filters
  const totalQuestionsAvailable = useMemo(() => {
    const selectedCourses = selectedCourseIds.map(id => getCourseById(id)).filter(Boolean);
    const chapterSet = new Set(selectedChapterIds);

    let count = 0;
    selectedCourses.forEach(course => {
      (course.questions || []).forEach(q => {
        if (chapterSet.has(q.chapterId)) {
          count++;
        }
      });
    });
    return count;
  }, [selectedCourseIds, selectedChapterIds]);

  // Start a new quiz
  const startQuiz = (customOverrides = {}) => {
    const config = { ...quizSettings, ...customOverrides };
    const selectedCourses = selectedCourseIds.map(id => getCourseById(id)).filter(Boolean);

    // Ensure we have active questions
    let maxAvailable = totalQuestionsAvailable;
    if (maxAvailable === 0) {
      // Fallback: reset all chapters of selected courses
      selectAllChapters();
      maxAvailable = TOTAL_QUESTIONS_COUNT;
    }

    let count = config.presetCount === 'all' ? maxAvailable : Number(config.presetCount);
    if (config.customCount) {
      count = Math.min(Math.max(5, Number(config.customCount)), maxAvailable);
    } else {
      count = Math.min(count, maxAvailable);
    }

    const sessionQuestions = generateQuizSession({
      selectedCourses,
      selectedChapterIds,
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
      const totalSeconds = sessionQuestions.length * config.timePerQuestion;
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

  // Submit quiz and calculate performance analytics with course AND chapter breakdowns
  const submitQuiz = (autoSubmitted = false) => {
    setTimerActive(false);
    const endTime = Date.now();
    const timeSpentSeconds = Math.round(((endTime - (startTime || endTime)) / 1000));

    let correctCount = 0;
    const answeredIds = [];
    const courseBreakdown = {};
    const chapterBreakdown = {};

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

      // Track by chapter
      const chKey = q.chapterId || q.topic || 'General';
      if (!chapterBreakdown[chKey]) {
        chapterBreakdown[chKey] = {
          id: q.chapterId,
          number: q.chapterNumber,
          title: q.chapterTitle || q.topic,
          shortTitle: q.chapterShortTitle || q.topic,
          courseCode: q.courseCode,
          total: 0,
          correct: 0,
          percentage: 0
        };
      }
      chapterBreakdown[chKey].total += 1;
      if (isCorrect) {
        chapterBreakdown[chKey].correct += 1;
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

    // Calculate chapter percentages
    Object.values(chapterBreakdown).forEach(item => {
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
      courseBreakdown: Object.values(courseBreakdown).filter(c => c.total > 0),
      chapterBreakdown: Object.values(chapterBreakdown).sort((a, b) => (a.number || 0) - (b.number || 0)),
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
        .map(q => ({ ...q }));
    } else {
      retakeQuestions = results.questions.map(q => ({ ...q }));
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
        deselectAllCourses,
        selectSingleCourse,
        clearSelectedCourses,
        selectedChapterIds,
        setSelectedChapterIds,
        toggleChapter,
        selectAllChaptersForCourse,
        clearChaptersForCourse,
        selectAllChapters,
        deselectAllChapters,
        isChapterSelected,
        getSelectedChapterCountForCourse,
        totalQuestionsAvailable,
        isChapterModalOpen,
        openChapterModal,
        closeChapterModal,
        modalActiveCourseId,
        setModalActiveCourseId,
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
