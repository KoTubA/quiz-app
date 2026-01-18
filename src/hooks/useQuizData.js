/**
 * Custom hook for fetching quiz data from local JSON file
 */
import { useState, useEffect } from "react";
import quizData from "../data/quizData.json";

export const useQuizData = () => {
  const [questionData, setQuestionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load from local JSON files
        const questions = quizData.questions;
        setQuestionData(questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Wystąpił błąd podczas wczytywania pytań.");
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
