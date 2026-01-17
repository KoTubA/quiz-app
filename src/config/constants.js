/**
 * Application Constants
 * Shared text labels and configuration
 */

export const UI_TEXT = {
  SUBMIT_ANSWER: "Zatwierdź odpowiedź",
  SUBMITTED_ANSWER: "Odpowiedź zatwierdzona",
  SHOW_ANSWER: "Pokaż odpowiedź",
  HIDE_ANSWER: "Ukryj odpowiedź",
  LOADING: "Ładowanie bazy pytań ...",
  RANDOM_BTN: "Losuj",
  NEXT_BTN: "Dalej",
  RESET_QUESTION: "Resetuj pytanie",
  RESET_ALL: "Resetuj wszystkie",
  SELECT_PLACEHOLDER: "Wybierz...",
  CORRECT_ANSWER_LABEL: "Poprawna odpowiedź:",
  ERROR_UNKNOWN_TYPE: "Nieznany typ pytania:",
};

export const QUESTION_TYPES = {
  SINGLE: "single",
  MULTIPLE: "multiple",
  OPEN: "open",
  MATCHING: "matching",
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.SINGLE]: "Jednokrotny wybór",
  [QUESTION_TYPES.MULTIPLE]: "Wielokrotny wybór",
  [QUESTION_TYPES.OPEN]: "Pytanie otwarte",
  [QUESTION_TYPES.MATCHING]: "Dopasowywanie",
};
