import { QUESTION_TYPE_LABELS } from "../../config/constants";

/**
 * QuestionDisplay Component
 * Displays the question title, metadata, and optional image
 */
const QuestionDisplay = ({ question, currentIndex, totalQuestions }) => {
  // Map question type to display label
  const getQuestionTypeLabel = (type) => {
    return QUESTION_TYPE_LABELS[type] || type;
  };

  return (
    <div>
      <div className="relative bg-surface-dark rounded-xl px-6 py-4 border border-slate-700 shadow-xl overflow-hidden group mb-6">
        <div className="absolute top-0 left-0 w-1 h-full bg-current"></div>
        <div className="flex justify-between items-start mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-300 border border-slate-700">
            <span className="size-1.5 rounded-full bg-current"></span>
            Pytanie {currentIndex + 1} z {totalQuestions}
          </span>
          <span className="text-slate-500 text-xs font-medium tracking-wide uppercase">{getQuestionTypeLabel(question.type)}</span>
        </div>
        <h2 className="text-xl leading-8 font-bold text-slate-100 whitespace-pre-line">{question.question}</h2>
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
