import React, { useState, useEffect } from "react";
import { useQuizData } from "../../hooks/useQuizData";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useQuizState } from "../../hooks/useQuizState";
import { checkSingleAnswer, checkMultipleAnswer, checkMatchingAnswer } from "../../utils/quizHelpers";
import { UI_TEXT } from "../../config/constants";
import IconRestart from "../../assets/icons/restart_alt.svg?react";
import IconDeleteSweep from "../../assets/icons/delete_sweep.svg?react";
import IconShuffle from "../../assets/icons/shuffle.svg?react";
import IconArrowForward from "../../assets/icons/arrow_forward.svg?react";
import QuestionNavigation from "./QuestionNavigation";
import QuestionDisplay from "./QuestionDisplay";
import QuestionRenderer from "./QuestionRenderer";

const Quiz = () => {
  // Fetch quiz data
  const { questionData, isLoading, error } = useQuizData();

  // Manage localStorage (only answer history/status)
  const { answerHistory, saveAnswerStatus, resetAnswerStatus, resetAllAnswerStatuses, loadCurrentIndex, saveCurrentIndex } = useLocalStorage();

  // Manage quiz state (selectedAnswer is temporary, not saved)
  const { currentQuestion, currentQuestionIndex, selectedAnswer, resetKey, handleNextQuestion, handleRandomQuestion, handleQuestionSelect, handleAnswerSelection, handleResetCurrentQuestion } = useQuizState(questionData, loadCurrentIndex, saveCurrentIndex);

  // Local state for submission status of the CURRENT question
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);

  // Reset submission state when question changes
  useEffect(() => {
    setIsQuestionSubmitted(false);
  }, [currentQuestionIndex, resetKey]);

  // Handle answer selection (just updates state, does NOT submit)
  const onAnswerSelect = (answer) => {
    // If already submitted, don't allow changing answer
    if (isQuestionSubmitted) return;
    handleAnswerSelection(answer);
  };

  // Handle submit button click
  const handleSubmit = () => {
    // Allow submit if we have an answer OR if it's an open question (which might not have a formal 'answer' payload until submit if we changed logic, but currently logic relies on selectedAnswer)
    // Actually for open questions, we just toggle reveal, so selectedAnswer might be null initially?
    // Let's stick to standard validation:
    if (!selectedAnswer && currentQuestion.type !== "open") return;

    let status = null;

    switch (currentQuestion.type) {
      case "single":
        status = checkSingleAnswer(currentQuestion, selectedAnswer.answer) ? "correct" : "wrong";
        break;
      case "multiple":
        const multipleResult = checkMultipleAnswer(currentQuestion, selectedAnswer.answer);
        status = multipleResult.isFullyCorrect ? "correct" : "wrong";
        break;
      case "matching":
        const matchingResult = checkMatchingAnswer(currentQuestion, selectedAnswer.answer);
        status = matchingResult.isFullyCorrect ? "correct" : "wrong";
        break;
      case "open":
        // Toggle reveal for open questions
        const newValue = selectedAnswer?.answer ? !selectedAnswer.answer : true;
        handleAnswerSelection({ type: "open", answer: newValue });
        if (newValue) {
          status = "answered";
        }
        break;
    }

    setIsQuestionSubmitted(true);

    if (status) {
      saveAnswerStatus(currentQuestion.id, status);
    }
  };

  // Handle reset current question
  const onResetCurrent = () => {
    resetAnswerStatus(currentQuestion.id);
    handleResetCurrentQuestion();
    setIsQuestionSubmitted(false);
  };

  // Handle reset all answers
  const onResetAll = () => {
    resetAllAnswerStatuses();
    handleResetCurrentQuestion();
    setIsQuestionSubmitted(false);
  };

  // Determine if answer is submitted based on question type

  // Get submit button text based on question type and state
  const getSubmitButtonText = () => {
    if (!currentQuestion) return UI_TEXT.SUBMIT_ANSWER;

    if (currentQuestion.type === "open") {
      return selectedAnswer?.answer ? UI_TEXT.HIDE_ANSWER : UI_TEXT.SHOW_ANSWER;
    }

    // For others
    return isQuestionSubmitted ? UI_TEXT.SUBMITTED_ANSWER : UI_TEXT.SUBMIT_ANSWER;
  };

  // Check if submit button should be disabled
  const isSubmitDisabled = () => {
    if (!currentQuestion) return true;
    if (isQuestionSubmitted && currentQuestion.type !== "open") return true; // Disable after submit for non-open questions

    switch (currentQuestion.type) {
      case "single":
        return !selectedAnswer?.answer;
      case "multiple":
      case "matching":
        return !selectedAnswer?.answer || (Array.isArray(selectedAnswer.answer) && selectedAnswer.answer.length === 0);
      case "open":
        return false; // Always enabled to toggle
      default:
        return true;
    }
  };

  if (error) {
    return (
      <main className="flex justify-center items-center text-white min-h-screen px-4">
        <p className="text-error text-center text-xl font-medium md:text-2xl">{error}</p>
      </main>
    );
  }

  if (isLoading || !currentQuestion || !questionData) {
    return (
      <main className="flex justify-center items-center text-white min-h-screen px-4">
        <p className="text-center text-xl font-medium md:text-2xl">{UI_TEXT.LOADING}</p>
      </main>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Fixed Navigation Header */}
      <QuestionNavigation questions={questionData} currentIndex={currentQuestionIndex} answerHistory={answerHistory} onQuestionClick={handleQuestionSelect} />

      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Reset Buttons */}
          <div className="flex justify-between mb-4">
            <button onClick={onResetCurrent} className="h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center gap-2 transition-all text-xs font-bold shadow-sm active:scale-95">
              <IconRestart className="w-[16px] h-[16px]" />
              {UI_TEXT.RESET_QUESTION}
            </button>
            <button onClick={onResetAll} className="h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-500 flex items-center gap-2 transition-all text-xs font-bold shadow-sm active:scale-95">
              <IconDeleteSweep className="w-[16px] h-[16px]" />
              {UI_TEXT.RESET_ALL}
            </button>
          </div>

          {/* Question Display */}
          <QuestionDisplay question={currentQuestion} currentIndex={currentQuestionIndex} totalQuestions={questionData.length} />

          {/* Question Renderer */}
          <div className="flex flex-col justify-center items-center gap-4 md:gap-8 w-full">
            <QuestionRenderer question={currentQuestion} selectedAnswer={selectedAnswer} onAnswerSelect={onAnswerSelect} isSubmitted={isQuestionSubmitted} resetKey={resetKey} />
          </div>
        </div>
      </main>

      {/* Sticky Footer with Action Buttons */}
      <footer className="fixed bottom-0 inset-x-0 bg-background-dark/95 backdrop-blur-xl border-t border-slate-800 z-50 px-4 py-3 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-[auto_1fr_auto] gap-3">
            <button onClick={handleRandomQuestion} className="h-12 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center gap-2 transition-all group font-semibold text-sm active:scale-95" title="Losowe pytanie">
              <span>{UI_TEXT.RANDOM_BTN}</span>
              <IconShuffle className="w-[20px] h-[20px]" />
            </button>
            <button onClick={handleSubmit} disabled={isSubmitDisabled()} className="h-12 w-full bg-primary hover:bg-blue-500 text-white font-bold text-base rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary">
              {getSubmitButtonText()}
            </button>
            <button onClick={handleNextQuestion} className="h-12 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center gap-2 transition-all group font-semibold text-sm active:scale-95" title="Pomiń pytanie">
              <span>{UI_TEXT.NEXT_BTN}</span>
              <IconArrowForward className="w-[20px] h-[20px] transition-transform" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Quiz;
