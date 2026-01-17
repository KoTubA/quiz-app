import React, { useState, useEffect, useMemo } from "react";
import { checkMultipleAnswer, shuffleArray } from "../../../utils/quizHelpers";

/**
 * MultipleQuestion Component
 * Displays multiple-choice question with checkboxes
 */
const MultipleQuestion = ({ question, selectedAnswer, onAnswerSelect, isSubmitted, resetKey }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Shuffle options - re-shuffle when question.id OR resetKey changes
  const shuffledOptions = useMemo(() => {
    return shuffleArray(question.options);
  }, [question.id, resetKey]);

  // Reset when question changes OR when reset button clicked
  useEffect(() => {
    setSelectedOptions([]);
  }, [question.id, resetKey]);

  const handleOptionToggle = (optionId) => {
    if (isSubmitted) return;

    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleSubmit = () => {
    onAnswerSelect({ type: "multiple", answer: selectedOptions });
  };

  // Get validation results if submitted
  const validationResults = isSubmitted ? checkMultipleAnswer(question, selectedAnswer?.answer || []) : null;

  return (
    <div className="flex flex-col gap-3 md:gap-4 w-full">
      {shuffledOptions.map((option, index) => {
        const isSelected = selectedOptions.includes(option.id);

        // Determine styling based on validation
        let borderColor = "border-surface-brand-2";
        let checkboxBg = "bg-white";
        let checkboxBorder = "border-gray-400";

        if (isSubmitted && validationResults) {
          if (validationResults.correctIds.includes(option.id)) {
            borderColor = "border-success";
            checkboxBg = "bg-success";
            checkboxBorder = "border-success";
          } else if (validationResults.incorrectIds.includes(option.id)) {
            borderColor = "border-error";
            checkboxBg = "bg-error";
            checkboxBorder = "border-error";
          } else if (validationResults.missedIds.includes(option.id)) {
            borderColor = "border-success";
            checkboxBg = "bg-success";
            checkboxBorder = "border-success";
          }
        } else if (isSelected) {
          checkboxBg = "bg-blue-500";
          checkboxBorder = "border-blue-500";
        }

        return (
          <button key={option.id} type="button" onClick={() => handleOptionToggle(option.id)} disabled={isSubmitted} className={`flex w-full ${isSubmitted ? "cursor-default" : "cursor-pointer"} items-center gap-3 rounded-xl border-2 bg-surface-brand-2 p-2.5 font-medium shadow md:gap-6 md:text-lg ${borderColor}`}>
            <div className={`flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-lg border-2 ${checkboxBorder} ${checkboxBg} transition-colors`}>
              {isSelected && (
                <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
            <span className="text-left break-words min-w-0 flex-1">{option.text}</span>
          </button>
        );
      })}

      <div className="mt-2">
        <button type="button" onClick={handleSubmit} disabled={selectedOptions.length === 0 || isSubmitted} className="w-full rounded-xl bg-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-90 transition-opacity">
          Zatwierdź odpowiedź
        </button>
      </div>
    </div>
  );
};

export default MultipleQuestion;
