/**
 * Custom hook for managing localStorage operations for the quiz
 * Stores only answer STATUS (correct/wrong/answered), not actual user answers
 */
import { useState, useEffect } from "react";

const STORAGE_KEYS = {
  ANSWER_HISTORY: "quiz_answer_history", // Changed from ANSWERS
  CURRENT_INDEX: "current_question_index",
};

export const useLocalStorage = () => {
  const [answerHistory, setAnswerHistory] = useState({});

  // Load answer history from localStorage on mount
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWER_HISTORY)) || {};
    setAnswerHistory(storedHistory);
  }, []);

  // Save answer history to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(answerHistory).length > 0 || localStorage.getItem(STORAGE_KEYS.ANSWER_HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.ANSWER_HISTORY, JSON.stringify(answerHistory));
    }
  }, [answerHistory]);

  /**
   * Save answer status for a specific question
   * @param {number} questionId - The question ID
   * @param {string} status - "correct", "wrong", or "answered" (for open questions)
   */
  const saveAnswerStatus = (questionId, status) => {
    setAnswerHistory((prev) => ({
      ...prev,
      [questionId]: status,
    }));
  };

  /**
   * Get answer status for a specific question
   * @param {number} questionId - The question ID
   * @returns {string|null} - "correct", "wrong", "answered", or null
   */
  const getAnswerStatus = (questionId) => {
    return answerHistory[questionId] || null;
  };

  /**
   * Reset answer status for a specific question
   */
  const resetAnswerStatus = (questionId) => {
    setAnswerHistory((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  /**
   * Reset all answer statuses
   */
  const resetAllAnswerStatuses = () => {
    setAnswerHistory({});
    localStorage.removeItem(STORAGE_KEYS.ANSWER_HISTORY);
  };

  /**
   * Load current question index from localStorage
   */
  const loadCurrentIndex = (totalQuestions) => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
    if (stored !== null) {
      const index = parseInt(stored, 10);
      // Validate index is within bounds
      if (index >= 0 && index < totalQuestions) {
        return index;
      }
    }
    return 0;
  };

  /**
   * Save current question index to localStorage
   */
  const saveCurrentIndex = (index) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, index.toString());
  };

  return {
    answerHistory,
    saveAnswerStatus,
    getAnswerStatus,
    resetAnswerStatus,
    resetAllAnswerStatuses,
    loadCurrentIndex,
    saveCurrentIndex,
  };
};
