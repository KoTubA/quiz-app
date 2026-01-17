/**
 * Custom hook for managing quiz state and navigation
 * Questions are always reset when navigating - no saved answers
 */
import { useState, useEffect } from "react";

export const useQuizState = (questionData, loadCurrentIndex, saveCurrentIndex) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [resetKey, setResetKey] = useState(0); // Key to trigger re-shuffle

  // Initialize current question index on mount
  useEffect(() => {
    if (questionData && questionData.length > 0) {
      const initialIndex = loadCurrentIndex(questionData.length);
      setCurrentQuestionIndex(initialIndex);
    }
  }, [questionData, loadCurrentIndex]);

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  // Get current question
  const currentQuestion = questionData && questionData.length > 0 ? questionData[currentQuestionIndex] : null;

  /**
   * Navigate to the next question
   */
  const handleNextQuestion = () => {
    if (!questionData) return;

    const nextIndex = (currentQuestionIndex + 1) % questionData.length;
    setCurrentQuestionIndex(nextIndex);
    saveCurrentIndex(nextIndex);
  };

  /**
   * Navigate to a random question
   */
  const handleRandomQuestion = () => {
    if (!questionData) return;

    const randomIndex = Math.floor(Math.random() * questionData.length);
    setCurrentQuestionIndex(randomIndex);
    saveCurrentIndex(randomIndex);
  };

  /**
   * Navigate to a specific question by index
   */
  const handleQuestionSelect = (index) => {
    if (!questionData) return;

    setCurrentQuestionIndex(index);
    saveCurrentIndex(index);
  };

  /**
   * Handle answer selection - format depends on question type
   */
  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  /**
   * Reset current question and trigger re-shuffle
   */
  const handleResetCurrentQuestion = () => {
    setSelectedAnswer(null);
    setResetKey((prev) => prev + 1); // Increment to trigger re-shuffle
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    resetKey,
    handleNextQuestion,
    handleRandomQuestion,
    handleQuestionSelect,
    handleAnswerSelection,
    handleResetCurrentQuestion,
  };
};
