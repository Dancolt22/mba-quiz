// src/utils/shuffle.js
// Robust Fisher-Yates shuffle algorithms and session non-repetition manager with course & chapter isolation

/**
 * Standard in-place Fisher-Yates shuffle for generic arrays
 */
export function fisherYatesShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shuffles the options of a single question and updates the correctAnswer index
 * to guarantee that grading remains 100% accurate.
 */
export function shuffleQuestionOptions(question) {
  const originalOptions = question.options;
  const originalCorrectIdx = question.correctAnswer;
  const correctOptionText = originalOptions[originalCorrectIdx];

  // Create indexed option pairs to trace movements
  const indexedOptions = originalOptions.map((text, idx) => ({
    text,
    isCorrect: idx === originalCorrectIdx
  }));

  // Shuffle option items
  const shuffledIndexed = fisherYatesShuffle(indexedOptions);

  // Find the new index of the correct answer
  const newCorrectIdx = shuffledIndexed.findIndex(item => item.isCorrect);

  return {
    ...question,
    options: shuffledIndexed.map(item => item.text),
    correctAnswer: newCorrectIdx,
    originalCorrectAnswerText: correctOptionText
  };
}

/**
 * Generates an optimized, non-repeating quiz session segmented by selected courses and chapters.
 * @param {Array} selectedCourses - Array of course objects
 * @param {Array|Set|null} selectedChapterIds - Optional array or set of chapter IDs to isolate
 * @param {number} totalQuestionsRequested - How many total questions to draw
 * @param {boolean} shuffleQuestions - Whether to shuffle the question order
 * @param {boolean} shuffleOptions - Whether to shuffle the 4 option choices per question
 * @param {boolean} prioritizeUnseen - Whether to prioritize unattempted questions from history
 */
export function generateQuizSession({
  selectedCourses,
  selectedChapterIds = null,
  totalQuestionsRequested,
  shuffleQuestions = true,
  shuffleOptions = true,
  prioritizeUnseen = true
}) {
  if (!selectedCourses || selectedCourses.length === 0) {
    return [];
  }

  const chapterFilterSet = selectedChapterIds 
    ? (selectedChapterIds instanceof Set ? selectedChapterIds : new Set(selectedChapterIds))
    : null;

  const historySet = getAnsweredQuestionHistory();

  // Prepare eligible questions for each selected course
  const eligiblePerCourse = selectedCourses.map(course => {
    let qs = course.questions || [];
    if (chapterFilterSet && chapterFilterSet.size > 0) {
      qs = qs.filter(q => chapterFilterSet.has(q.chapterId));
    }
    return {
      course,
      questions: qs
    };
  }).filter(item => item.questions.length > 0);

  if (eligiblePerCourse.length === 0) {
    return [];
  }

  const totalAvailable = eligiblePerCourse.reduce((acc, item) => acc + item.questions.length, 0);
  const targetCount = Math.min(totalQuestionsRequested, totalAvailable);

  const numActiveCourses = eligiblePerCourse.length;
  const basePerCourse = Math.floor(targetCount / numActiveCourses);
  let remainder = targetCount % numActiveCourses;

  let pool = [];

  eligiblePerCourse.forEach(({ course, questions: courseQuestions }) => {
    let countToTake = basePerCourse + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
    countToTake = Math.min(countToTake, courseQuestions.length);

    if (prioritizeUnseen) {
      // Split into unseen vs seen
      const unseen = courseQuestions.filter(q => !historySet.has(q.id));
      const seen = courseQuestions.filter(q => historySet.has(q.id));

      const shuffledUnseen = fisherYatesShuffle(unseen);
      const shuffledSeen = fisherYatesShuffle(seen);

      const courseDrawn = [...shuffledUnseen, ...shuffledSeen].slice(0, countToTake);
      pool.push(...courseDrawn);
    } else {
      const shuffled = fisherYatesShuffle(courseQuestions);
      pool.push(...shuffled.slice(0, countToTake));
    }
  });

  // If options shuffle is enabled, shuffle each question's choices
  if (shuffleOptions) {
    pool = pool.map(q => shuffleQuestionOptions(q));
  }

  // If questions shuffle is enabled, shuffle across courses and chapters for a balanced mix
  if (shuffleQuestions) {
    pool = fisherYatesShuffle(pool);
  }

  return pool;
}

// Local Storage History helpers for persistent mastery tracking
const HISTORY_KEY = 'mba_quiz_history_v1';
const ATTEMPTS_KEY = 'mba_quiz_attempts_v1';

export function getAnsweredQuestionHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch (e) {
    return new Set();
  }
}

export function saveAnsweredQuestions(questionIds) {
  try {
    const existing = getAnsweredQuestionHistory();
    questionIds.forEach(id => existing.add(id));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(Array.from(existing)));
  } catch (e) {
    console.error('Failed to persist question history:', e);
  }
}

export function clearQuestionHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {}
}

export function getSavedAttempts() {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveAttemptResult(attempt) {
  try {
    const attempts = getSavedAttempts();
    attempts.unshift(attempt); // newest first
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts.slice(0, 50))); // Keep last 50 attempts
  } catch (e) {
    console.error('Failed to save attempt:', e);
  }
}
