import React from "react";

/**
 * ActionButtons Component
 * Control buttons for quiz navigation and reset operations
 */
const ActionButtons = ({ onRandom, onNext, onResetCurrent, onResetAll }) => {
  return (
    <>
      {/* Navigation buttons */}
      <div className="flex w-full gap-3 flex-col md:flex-row">
        <button type="button" onClick={onRandom} className="w-full rounded-xl bg-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
          Losuj pytanie
        </button>
        <button type="button" onClick={onNext} className="w-full rounded-xl border-2 border-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
          Kolejne pytanie
        </button>
      </div>

      {/* Reset buttons */}
      <div className="flex w-full gap-3 flex-col md:flex-row justify-end">
        <button type="button" onClick={onResetCurrent} className="rounded-xl bg-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
          Zresetuj to pytanie
        </button>
        <button type="button" onClick={onResetAll} className="rounded-xl border-2 border-surface-accent-1 py-3 px-6 font-medium shadow md:text-xl">
          Zresetuj odpowiedzi
        </button>
      </div>
    </>
  );
};

export default ActionButtons;
