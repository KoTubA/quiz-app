import React from "react";
import { checkSingleAnswer, checkMultipleAnswer, checkMatchingAnswer } from "../../utils/quizHelpers";

/**
 * QuestionNavigation Component
 * Displays numbered list of all questions with answer history
 */
const QuestionNavigation = ({ questions, currentIndex, answerHistory, onQuestionClick }) => {
  return (
    <div className="mb-6 max-h-36 overflow-y-auto bg-surface-brand-2 p-3 rounded-xl section-scroll">
      <ul className="flex flex-wrap w-full">
        {questions.map((question, index) => {
          const answerStatus = answerHistory[question.id];
          const isCurrent = index === currentIndex;

          // Determine background color based on state
          let bgColor = "bg-slate-100 text-slate-500"; // Default: unanswered

          if (isCurrent) {
            bgColor = "bg-surface-accent-1 text-white"; // Current question
          } else if (answerStatus === "correct") {
            bgColor = "bg-success text-white"; // Correct answer
          } else if (answerStatus === "wrong") {
            bgColor = "bg-error text-white"; // Wrong answer
          } else if (answerStatus === "answered") {
            bgColor = "bg-blue-500 text-white"; // Answered (for open questions)
          }

          return (
            <li key={index + 1} className={`flex justify-center items-center p-1 m-1 w-8 h-8 rounded-xl list-none cursor-pointer ${bgColor} hover:opacity-80 transition-opacity`} onClick={() => onQuestionClick(index)}>
              {index + 1}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default QuestionNavigation;
