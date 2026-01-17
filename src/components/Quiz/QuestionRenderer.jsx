import React from "react";
import SingleQuestion from "./QuestionTypes/SingleQuestion";
import MultipleQuestion from "./QuestionTypes/MultipleQuestion";
import OpenQuestion from "./QuestionTypes/OpenQuestion";
import MatchingQuestion from "./QuestionTypes/MatchingQuestion";

/**
 * QuestionRenderer Component
 * Routes to the appropriate question component based on question type
 */
const QuestionRenderer = ({ question, selectedAnswer, onAnswerSelect, isSubmitted, resetKey }) => {
  switch (question.type) {
    case "single":
      return <SingleQuestion question={question} selectedAnswer={selectedAnswer} onAnswerSelect={onAnswerSelect} isSubmitted={isSubmitted} resetKey={resetKey} />;

    case "multiple":
      return <MultipleQuestion question={question} selectedAnswer={selectedAnswer} onAnswerSelect={onAnswerSelect} isSubmitted={isSubmitted} resetKey={resetKey} />;

    case "open":
      return <OpenQuestion question={question} selectedAnswer={selectedAnswer} onAnswerSelect={onAnswerSelect} />;

    case "matching":
      return <MatchingQuestion question={question} selectedAnswer={selectedAnswer} onAnswerSelect={onAnswerSelect} isSubmitted={isSubmitted} resetKey={resetKey} />;

    default:
      return <div className="text-error text-center p-4">Nieznany typ pytania: {question.type}</div>;
  }
};

export default QuestionRenderer;
