import React from "react";
import IconCheckCircle from "../../../assets/icons/check_circle.svg?react";

/**
 * OpenQuestion Component
 * Displays open-ended question with answer reveal
 */
const OpenQuestion = ({ question, selectedAnswer, onAnswerSelect }) => {
  const isRevealed = selectedAnswer?.answer === true;

  return (
    <div className="flex flex-col gap-6 w-full">
      {isRevealed && (
        <div className="relative rounded-xl border border-success/20 bg-surface-dark p-6 w-full shadow-lg shadow-success/5 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
          <h3 className="text-lg font-bold mb-3 text-success flex items-center gap-2">
            <IconCheckCircle className="w-[1em] h-[1em]" />
            Wzorcowa odpowiedź
          </h3>
          <div className="text-base md:text-lg leading-relaxed text-slate-300 whitespace-pre-line pl-1">{question.answer}</div>
        </div>
      )}
    </div>
  );
};

export default OpenQuestion;
