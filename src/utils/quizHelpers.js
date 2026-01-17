/**
 * Quiz Helper Utilities
 * Pure functions for quiz operations
 */

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Converts a numeric index to an answer label (A, B, C, D, E, etc.)
 * @param {number} index - The numeric index (0-based)
 * @returns {string} - The corresponding letter
 */
export const getAnswerLabel = (index) => {
  return String.fromCharCode(65 + index);
};

/**
 * Check if a single-choice answer is correct
 * @param {Object} question - The single question object
 * @param {string} userAnswer - The selected option id
 * @returns {boolean} - Whether the answer is correct
 */
export const checkSingleAnswer = (question, userAnswer) => {
  const selectedOption = question.options.find((opt) => opt.id === userAnswer);
  return selectedOption ? selectedOption.isCorrect : false;
};

/**
 * Check multiple-choice answers and return results
 * @param {Object} question - The multiple question object
 * @param {string[]} userAnswers - Array of selected option ids
 * @returns {Object} - Object with correctIds, incorrectIds, and missedIds
 */
export const checkMultipleAnswer = (question, userAnswers) => {
  // Defensive check: ensure userAnswers is an array
  const answers = Array.isArray(userAnswers) ? userAnswers : [];

  const correctOptions = question.options.filter((opt) => opt.isCorrect);
  const correctIds = correctOptions.map((opt) => opt.id);

  const selectedCorrect = answers.filter((id) => correctIds.includes(id));
  const selectedIncorrect = answers.filter((id) => !correctIds.includes(id));
  const missedCorrect = correctIds.filter((id) => !answers.includes(id));

  return {
    correctIds: selectedCorrect,
    incorrectIds: selectedIncorrect,
    missedIds: missedCorrect,
    isFullyCorrect: selectedCorrect.length === correctIds.length && selectedIncorrect.length === 0,
  };
};

/**
 * Check matching answers and return results
 * @param {Object} question - The matching question object
 * @param {Object} userMatches - Object mapping left items to selected right options
 * @returns {Object} - Object with correct and incorrect matches
 */
export const checkMatchingAnswer = (question, userMatches) => {
  const results = {};

  question.items.forEach((item) => {
    const userSelection = userMatches[item.left];
    results[item.left] = {
      isCorrect: userSelection === item.correctRight,
      correctAnswer: item.correctRight,
      userAnswer: userSelection,
    };
  });

  const allCorrect = Object.values(results).every((r) => r.isCorrect);

  return {
    results,
    isFullyCorrect: allCorrect,
  };
};
