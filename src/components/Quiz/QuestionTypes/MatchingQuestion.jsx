import React, { useState, useEffect } from "react";
import { checkMatchingAnswer } from "../../../utils/quizHelpers";

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

    setMatches((prev) => ({
      ...prev,
      [leftItem]: rightOption,
    }));
  };

  const handleSubmit = () => {
    onAnswerSelect({ type: "matching", answer: matches });
  };

  // Get validation results if submitted
  const validationResults = isSubmitted ? checkMatchingAnswer(question, selectedAnswer?.answer || {}) : null;

  // Check if all items have been matched
  const allMatched = question.items.every((item) => matches[item.left]);

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {question.items.map((item, index) => {
        const userMatch = matches[item.left];
        const itemResult = validationResults?.results[item.left];

        // Determine styling
        let borderColor = "border-surface-brand-2";
        let selectBorderColor = "border-gray-300";

        if (isSubmitted && itemResult) {
          if (itemResult.isCorrect) {
            borderColor = "border-success";
            selectBorderColor = "border-success";
          } else {
            borderColor = "border-error";
            selectBorderColor = "border-error";
          }
        }

        return (
          <div key={index} className={`flex flex-col gap-3 rounded-xl border-2 bg-surface-brand-2 p-4 w-full ${borderColor}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Left side - 2/3 width */}
              <div className="flex-1 md:w-2/3 font-medium md:text-lg">{item.left}</div>

              {/* Right side - 1/3 width */}
              <div className="md:w-1/3">
                <select value={userMatch || ""} onChange={(e) => handleMatchChange(item.left, e.target.value)} disabled={isSubmitted} className={`rounded-lg border-2 ${selectBorderColor} bg-white px-3 py-2 font-medium text-gray-900 text-sm md:text-base disabled:opacity-70 disabled:cursor-not-allowed w-full`}>
                  <option value="">Wybierz...</option>
                  {question.rightOptions.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isSubmitted && itemResult && !itemResult.isCorrect && <div className="text-sm md:text-base text-success font-medium pl-2">✓ Poprawna odpowiedź: {itemResult.correctAnswer}</div>}
          </div>
        );
      })}

      <div className="mt-2">
        <button type="button" onClick={handleSubmit} disabled={!allMatched || isSubmitted} className="w-full rounded-xl bg-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-90 transition-opacity">
          Zatwierdź odpowiedź
        </button>
      </div>
    </div>
  );
};

export default MatchingQuestion;
