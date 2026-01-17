import React from "react";

/**
 * QuestionDisplay Component
 * Displays the question title, metadata, and optional image
 */
const QuestionDisplay = ({ question, currentIndex, totalQuestions }) => {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex gap-2 justify-between">
          <span className="text-sm md:text-xl italic text-foreground-brand/70">
            Pytanie numer {currentIndex + 1} z {totalQuestions}
          </span>
          <span className="text-sm md:text-xl italic text-foreground-brand/70">Pytanie ID: {question.id}</span>
        </div>
        <p className="text-xl font-medium md:text-2xl">
          {question.question.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
      {question.image && (
        <div className="mb-6">
          <img src={question.image} alt="Ilustracja do pytania" className="w-full h-auto rounded-xl" />
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
