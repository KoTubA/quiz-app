import React, { useState, useEffect } from "react";
import { checkMatchingAnswer } from "../../../utils/quizHelpers";
import { UI_TEXT } from "../../../config/constants";
import IconCheckCircle from "../../../assets/icons/check_circle.svg?react";

/**
 * MatchingQuestion Component
 * Displays matching question with dropdowns for each item
 */
const MatchingQuestion = ({ question, selectedAnswer, onAnswerSelect, isSubmitted, resetKey }) => {
  const [matches, setMatches] = useState({});

  // Reset when question changes OR when reset button clicked
  useEffect(() => {
    setMatches({});
  }, [question.id, resetKey]);

  const handleMatchChange = (leftItem, rightOption) => {
    if (isSubmitted) return;

    setMatches((prev) => {
      const newMatches = {
        ...prev,
        [leftItem]: rightOption,
      };
      // Propagate to parent immediately
      onAnswerSelect({ type: "matching", answer: newMatches });
      return newMatches;
    });
  };

  // Get validation results if submitted
  const validationResults = isSubmitted ? checkMatchingAnswer(question, selectedAnswer?.answer || {}) : null;

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {question.items.map((item, index) => {
        const userMatch = matches[item.left];
        const itemResult = validationResults?.results[item.left];

        // Determine styling
        let borderColor = "border-slate-700";
        let selectBorderColor = "border-slate-600";
        let bgColor = "bg-surface-dark";

        if (isSubmitted && itemResult) {
          if (itemResult.isCorrect) {
            borderColor = "border-success";
            selectBorderColor = "border-success";
            bgColor = "bg-[rgba(16,185,129,0.1)]";
          } else {
            borderColor = "border-error";
            selectBorderColor = "border-error";
            bgColor = "bg-[rgba(239,68,68,0.1)]";
          }
        }

        return (
          <div key={index} className={`flex flex-col gap-3 rounded-xl border p-4 w-full transition-colors ${bgColor} ${borderColor}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Left side */}
              <div className="flex-1 md:w-2/3 font-medium md:text-lg text-slate-200">{item.left}</div>

              {/* Right side */}
              <div className="md:w-1/3">
                <select name={`match-${item.left}-${index}`} id={`match-${index}`} aria-label={`Dopasuj do ${item.left}`} value={userMatch || ""} onChange={(e) => handleMatchChange(item.left, e.target.value)} disabled={isSubmitted} className={`rounded-lg border ${selectBorderColor} bg-slate-800 px-3 py-2 font-medium text-white text-sm md:text-base disabled:opacity-70 disabled:cursor-not-allowed w-full focus:outline-none focus:border-primary transition-colors`}>
                  <option value="" className="text-slate-400">
                    {UI_TEXT.SELECT_PLACEHOLDER}
                  </option>
                  {question.rightOptions.map((option, optIndex) => (
                    <option key={optIndex} value={option} className="text-white bg-slate-800">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isSubmitted && itemResult && !itemResult.isCorrect && (
              <div className="text-sm md:text-base text-success font-bold pl-2 flex items-start gap-2">
                <IconCheckCircle className="text-lg w-[1em] h-[1em] flex-shrink-0" />
                {UI_TEXT.CORRECT_ANSWER_LABEL} {itemResult.correctAnswer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MatchingQuestion;
