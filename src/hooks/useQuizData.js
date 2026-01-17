/**
 * Custom hook for fetching quiz data from local JSON file
 */
import { useState, useEffect } from "react";
import { quizConfig } from "../config/quizConfig";

export const useQuizData = () => {
  const [questionData, setQuestionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load from local JSON file
        const quizData = await import(/* @vite-ignore */ quizConfig.LOCAL_DATA_PATH);
        const questions = quizData.default.questions || quizData.questions;

        // Questions 29 and 68 have been removed from the JSON file
        // No filtering needed
        setQuestionData(questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Wystąpił błąd podczas wczytywania pytań z pliku lokalnego.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return {
    questionData,
    isLoading,
    error,
  };
};
