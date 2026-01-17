import React from "react";

/**
 * OpenQuestion Component
 * Displays open-ended question with "Show Answer" button
 */
const OpenQuestion = ({ question, selectedAnswer, onAnswerSelect }) => {
  const isRevealed = selectedAnswer?.answer === true;

  const handleToggleAnswer = () => {
    // Toggle between revealed and hidden
    onAnswerSelect({ type: "open", answer: !isRevealed });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {isRevealed && (
        <div className="rounded-xl border-2 border-success bg-surface-brand-2 p-6 w-full">
          <h3 className="text-lg font-semibold mb-3 text-success">Wzorcowa odpowiedź:</h3>
          <div className="text-base md:text-lg whitespace-pre-line">{question.answer}</div>
        </div>
      )}

      <button type="button" onClick={handleToggleAnswer} className="w-full rounded-xl bg-surface-accent-1 py-4 px-6 font-medium shadow md:text-xl hover:opacity-90 transition-opacity">
        {isRevealed ? "Ukryj odpowiedź" : "Pokaż odpowiedź"}
      </button>
    </div>
  );
};

export default OpenQuestion;
