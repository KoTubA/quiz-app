import React from "react";
import PropTypes from "prop-types";

/**
 * QuestionOption Component
 * Reusable option component for Single and Multiple choice questions
 * Handles styling for default, selected, correct, and incorrect states
 */
const QuestionOption = ({
  id,
  text,
  isSelected,
  isSubmitted,
  status = "default", // 'correct', 'incorrect', 'default'
  type = "checkbox", // 'checkbox' | 'radio'
  name, // required for radio types
  onChange,
}) => {
  // Determine styling based on status
  let borderColor = "border-slate-700";
  let bgColor = "bg-surface-dark";

  if (isSubmitted) {
    if (status === "correct") {
      borderColor = "border-success";
      bgColor = "bg-correct/10";
    } else if (status === "incorrect") {
      borderColor = "border-error";
      bgColor = "bg-incorrect/10";
    } else {
      // Neutral options (neither correct nor incorrect)
      bgColor = "bg-[rgba(30,41,59,0.1)]";
    }
  } else if (isSelected) {
    borderColor = "border-primary";
  }

  const hoverClasses = isSubmitted ? "cursor-default" : "cursor-pointer hover:bg-slate-700/60 active:bg-slate-700";
  const opacityClass = isSubmitted && status === "default" ? "opacity-50" : "opacity-100";

  return (
    <label className={`group relative flex items-center p-4 rounded-xl border ${borderColor} ${bgColor} transition-all select-none ${hoverClasses} ${opacityClass}`}>
      <input className="custom-checkbox sr-only" name={name} type={type} checked={isSelected} onChange={() => !isSubmitted && onChange(id)} disabled={isSubmitted} />

      {/* Visual checkbox/radio indicator */}
      <div className={`flex items-center justify-center size-5 rounded ${type === "radio" ? "rounded-full" : "rounded"} border ${isSelected ? "border-primary bg-primary" : "border-slate-500 bg-transparent"} transition-all duration-200 mr-4 shrink-0`}>
        {isSelected && (
          <svg className={`w-3.5 h-3.5 text-white transition-all duration-200 ${type === "radio" ? "scale-75" : "scale-100"}`} fill={type === "radio" ? "currentColor" : "none"} stroke={type === "radio" ? "none" : "currentColor"} strokeWidth="3" viewBox="0 0 24 24">
            {type === "radio" ? <circle cx="12" cy="12" r="12" /> : <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>}
          </svg>
        )}
      </div>

      <span className={`flex-1 text-base font-medium text-slate-300 transition-colors ${!isSubmitted ? "group-hover:text-white" : ""}`}>{text}</span>
    </label>
  );
};

QuestionOption.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  status: PropTypes.oneOf(["correct", "incorrect", "default"]),
  type: PropTypes.oneOf(["checkbox", "radio"]),
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default QuestionOption;
