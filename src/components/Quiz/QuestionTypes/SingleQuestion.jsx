import React, { useMemo } from "react";
import { shuffleArray } from "../../../utils/quizHelpers";
import QuestionOption from "../QuestionOption";

/**
 * SingleQuestion Component
 * Displays single-choice question using reusable QuestionOption
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
    <div className="space-y-3 w-full">
      {shuffledOptions.map((option) => {
        const isSelected = selectedAnswer?.answer === option.id;

        // Determine status based on validation
        let status = "default";
        if (isSubmitted) {
          if (option.isCorrect) {
            status = "correct";
          } else if (isSelected && !option.isCorrect) {
            status = "incorrect";
          }
        }

        return <QuestionOption key={option.id} id={option.id} text={option.text} isSelected={isSelected} isSubmitted={isSubmitted} status={status} type="radio" name={`question-${question.id}`} onChange={handleOptionClick} />;
      })}
    </div>
  );
};

export default SingleQuestion;
