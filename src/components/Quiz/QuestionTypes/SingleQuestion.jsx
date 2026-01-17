import React, { useMemo } from "react";
import { getAnswerLabel, shuffleArray } from "../../../utils/quizHelpers";

/**
 * SingleQuestion Component
 * Displays single-choice question with radio buttons
 */
const SingleQuestion = ({ question, selectedAnswer, onAnswerSelect, isSubmitted, resetKey }) => {
  // Shuffle options - re-shuffle when question.id OR resetKey changes
  const shuffledOptions = useMemo(() => {
    return shuffleArray(question.options);
  }, [question.id, resetKey]);

  const handleOptionClick = (optionId) => {
    if (isSubmitted) return;
    onAnswerSelect({ type: "single", answer: optionId });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {shuffledOptions.map((option, index) => {
        const isSelected = selectedAnswer?.answer === option.id;
        const showFeedback = isSubmitted && isSelected;

        // Determine border and label colors
        let borderColor = "border-surface-brand-2";
        let labelBgColor = "bg-slate-100 text-slate-500";

        if (showFeedback) {
          if (option.isCorrect) {
            borderColor = "border-success";
            labelBgColor = "bg-success text-white";
          } else {
            borderColor = "border-error";
            labelBgColor = "bg-error text-white";
          }
        }

        // Show correct answer if submitted and this is the correct option
        if (isSubmitted && option.isCorrect && !isSelected) {
          borderColor = "border-success";
          labelBgColor = "bg-success text-white";
        }

        return (
          <button key={option.id} type="button" onClick={() => handleOptionClick(option.id)} disabled={isSubmitted} className={`flex w-full ${isSubmitted ? "cursor-default" : "cursor-pointer"} items-center gap-4 rounded-xl border-2 bg-surface-brand-2 p-3 font-medium shadow md:gap-8 md:text-xl ${borderColor}`}>
            <span className={`flex flex-shrink-0 justify-center items-center h-12 w-12 rounded-xl ${labelBgColor}`}>{getAnswerLabel(index)}</span>
            <span className="text-left break-words min-w-0 flex-1">{option.text}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SingleQuestion;
