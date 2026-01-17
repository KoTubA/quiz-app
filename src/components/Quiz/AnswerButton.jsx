import React from "react";
import { getAnswerLabel } from "../../utils/quizHelpers";

/**
 * AnswerButton Component
 * Single answer option with visual feedback
 */
const AnswerButton = ({ answer, index, isCorrect, isWrong, isSelected, onClick, disabled }) => {
  // Determine border color
  let borderColor = "border-surface-brand-2";
  if (isSelected) {
    if (isCorrect) {
      borderColor = "border-success";
    } else if (isWrong) {
      borderColor = "border-error";
    }
  }

  // Determine label background color
  let labelBgColor = "bg-slate-100 text-slate-500";
  if (isSelected) {
    if (isCorrect) {
      labelBgColor = "bg-success text-white";
    } else if (isWrong) {
      labelBgColor = "bg-error text-white";
    }
  }

  return (
    <div className="w-full">
      <button className={`flex w-full ${disabled ? "cursor-default" : "cursor-pointer"} items-center gap-4 rounded-xl border-2 bg-surface-brand-2 p-3 font-medium shadow md:gap-8 md:text-xl ${borderColor}`} onClick={onClick} disabled={disabled}>
        <span className={`flex flex-shrink-0 justify-center items-center h-12 w-12 rounded-xl ${labelBgColor}`}>{getAnswerLabel(index)}</span>
        <span className="text-left break-words min-w-0">{answer}</span>
      </button>
    </div>
  );
};

export default AnswerButton;
