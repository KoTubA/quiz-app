import React from "react";
import PropTypes from "prop-types";

/**
 * QuestionNavigation Component
 * Displays numbered grid of all questions with answer history
 * Fixed header with horizontal scroll
 */
const QuestionNavigation = ({ questions, currentIndex, answerHistory, onQuestionClick }) => {
  return (
    <section className="bg-background-dark border-b border-slate-800 shadow-xl z-40 relative pt-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="overflow-y-auto scrollbar-hide p-2 max-h-[90px]">
          <div className="flex flex-wrap gap-2 w-full">
            {questions.map((question, index) => {
              const answerStatus = answerHistory[question.id];
              const isCurrent = index === currentIndex;

              // Determine styling based on state
              let buttonClasses = "";

              if (isCurrent) {
                // Current question: purple with ring, glow, and pulse
                buttonClasses = "relative bg-current text-white ring-2 ring-current ring-offset-2 ring-offset-background-dark z-10 shadow-[0_0_12px_rgba(139,92,246,0.6)] animate-pulse";
              } else if (answerStatus === "correct") {
                // Correct answer: green with glow
                buttonClasses = "bg-correct text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]";
              } else if (answerStatus === "wrong") {
                // Wrong answer: red with glow
                buttonClasses = "bg-incorrect text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]";
              } else if (answerStatus === "answered") {
                // Answered (for open questions): blue
                buttonClasses = "bg-correct text-white";
              } else {
                // Unanswered: dark gray
                buttonClasses = "bg-slate-700 text-slate-400 border border-slate-600";
              }

              return (
                <button key={index + 1} onClick={() => onQuestionClick(index)} className={`flex items-center justify-center size-8 rounded-full text-xs font-bold cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark ${buttonClasses}`} aria-label={`Przejdź do pytania ${index + 1}`} aria-current={isCurrent ? "step" : undefined}>
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionNavigation;

QuestionNavigation.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      // Add other question props as needed
    }),
  ).isRequired,
  currentIndex: PropTypes.number.isRequired,
  answerHistory: PropTypes.object.isRequired,
  onQuestionClick: PropTypes.func.isRequired,
};
