import React from "react";
import { useQuizData } from "../../hooks/useQuizData";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useQuizState } from "../../hooks/useQuizState";
import { checkSingleAnswer, checkMultipleAnswer, checkMatchingAnswer } from "../../utils/quizHelpers";
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

  // Handle answer selection and save status to localStorage
  const onAnswerSelect = (answer) => {
    handleAnswerSelection(answer);

    // Determine if answer is correct and save status
    let status = null;

    switch (currentQuestion.type) {
      case "single":
        status = checkSingleAnswer(currentQuestion, answer.answer) ? "correct" : "wrong";
        break;
      case "multiple":
        const multipleResult = checkMultipleAnswer(currentQuestion, answer.answer);
        status = multipleResult.isFullyCorrect ? "correct" : "wrong";
        break;
      case "matching":
        const matchingResult = checkMatchingAnswer(currentQuestion, answer.answer);
        status = matchingResult.isFullyCorrect ? "correct" : "wrong";
        break;
      case "open":
        status = "answered"; // Open questions don't have correct/wrong
        break;
    }

    if (status) {
      saveAnswerStatus(currentQuestion.id, status);
    }
  };

  // Handle reset current question
  const onResetCurrent = () => {
    resetAnswerStatus(currentQuestion.id);
    handleResetCurrentQuestion();
  };

  // Handle reset all answers
  const onResetAll = () => {
    resetAllAnswerStatuses();
    handleResetCurrentQuestion();
  };

  // Determine if answer is submitted based on question type
  const isSubmitted = () => {
    if (!selectedAnswer) return false;

    switch (currentQuestion?.type) {
      case "single":
        // Single choice auto-submits on selection
        return selectedAnswer.answer !== null && selectedAnswer.answer !== undefined;
      case "multiple":
      case "matching":
        // Multiple and matching require explicit submit
        return selectedAnswer.answer && (Array.isArray(selectedAnswer.answer) ? selectedAnswer.answer.length > 0 : Object.keys(selectedAnswer.answer).length > 0);
      case "open":
        // Open questions are "submitted" when answer is revealed
        return selectedAnswer.answer === true;
      default:
        return false;
    }
  };

  return (
    <main className="flex justify-center text-white min-h-screen px-4 py-4 lg:py-12">
      <section className="max-w-3xl w-full">
        {error ? (
          <p className="text-error text-center text-xl font-medium md:text-2xl">{error}</p>
        ) : isLoading ? (
          <p className="text-center text-xl font-medium md:text-2xl">Ładowanie bazy pytań ...</p>
        ) : currentQuestion && questionData ? (
          <div className="flex md:flex-col flex-col-reverse md:gap-6 gap-12">
            {/* Bottom section: Navigation */}
            <div className="flex flex-col">
              <QuestionNavigation questions={questionData} currentIndex={currentQuestionIndex} answerHistory={answerHistory} onQuestionClick={handleQuestionSelect} />
              <div className="flex w-full gap-3 flex-col md:flex-row justify-end">
                <button type="button" onClick={onResetCurrent} className="rounded-xl bg-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
                  Zresetuj to pytanie
                </button>
                <button type="button" onClick={onResetAll} className="rounded-xl border-2 border-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
                  Zresetuj odpowiedzi
                </button>
              </div>
            </div>

            {/* Top section: Question and Answers */}
            <div>
              <QuestionDisplay question={currentQuestion} currentIndex={currentQuestionIndex} totalQuestions={questionData.length} />

              <div className="flex flex-col justify-center items-center gap-4 md:gap-8 w-full">
                <QuestionRenderer question={currentQuestion} selectedAnswer={selectedAnswer} onAnswerSelect={onAnswerSelect} isSubmitted={isSubmitted()} resetKey={resetKey} />

                <div className="flex w-full gap-3 flex-col md:flex-row">
                  <button type="button" onClick={handleRandomQuestion} className="w-full rounded-xl bg-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl hover:opacity-90 transition-opacity">
                    Losuj pytanie
                  </button>
                  <button type="button" onClick={handleNextQuestion} className="w-full rounded-xl border-2 border-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl hover:opacity-90 transition-opacity">
                    Kolejne pytanie
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl font-medium md:text-2xl">Ładowanie bazy pytań ...</p>
        )}
      </section>
    </main>
  );
};

export default Quiz;
