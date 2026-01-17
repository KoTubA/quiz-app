import React, { useState, useEffect, useMemo } from "react";
import { checkMultipleAnswer, shuffleArray } from "../../../utils/quizHelpers";
import QuestionOption from "../QuestionOption";

/**
 * MultipleQuestion Component
 * Displays multiple-choice question using reusable QuestionOption
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
      const newSelection = prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId];
      onAnswerSelect({ type: "multiple", answer: newSelection });
      return newSelection;
    });
  };

  // Get validation results if submitted
  const validationResults = isSubmitted ? checkMultipleAnswer(question, selectedAnswer?.answer || []) : null;

  return (
    <div className="flex flex-col gap-3 md:gap-4 w-full">
      <div className="space-y-3 w-full">
        {shuffledOptions.map((option) => {
          const isSelected = selectedOptions.includes(option.id);

          // Determine status based on validation
          let status = "default";
          if (isSubmitted && validationResults) {
            if (validationResults.correctIds.includes(option.id)) {
              status = "correct";
            } else if (validationResults.incorrectIds.includes(option.id)) {
              status = "incorrect";
            } else if (validationResults.missedIds.includes(option.id)) {
              status = "correct";
            }
          }

          return <QuestionOption key={option.id} id={option.id} text={option.text} isSelected={isSelected} isSubmitted={isSubmitted} status={status} type="checkbox" onChange={handleOptionToggle} />;
        })}
      </div>
    </div>
  );
};

export default MultipleQuestion;
