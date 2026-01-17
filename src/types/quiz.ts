/**
 * Quiz Type Definitions
 * Defines all question types and answer formats
 */

// Base question interface with common fields
interface QuestionBase {
  id: number;
  question: string;
  image: string | null;
}

// Single choice question (radio buttons)
export interface SingleQuestion extends QuestionBase {
  type: "single";
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

// Multiple choice question (checkboxes)
export interface MultipleQuestion extends QuestionBase {
  type: "multiple";
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

// Open-ended question (show answer)
export interface OpenQuestion extends QuestionBase {
  type: "open";
  answer: string;
}

// Matching question (dropdowns)
export interface MatchingQuestion extends QuestionBase {
  type: "matching";
  items: {
    left: string;
    correctRight: string;
  }[];
  rightOptions: string[];
}

// Union type for all question types
export type Question = SingleQuestion | MultipleQuestion | OpenQuestion | MatchingQuestion;

// User answer formats for different question types
export type UserAnswer =
  | { type: "single"; answer: string } // Selected option id
  | { type: "multiple"; answer: string[] } // Array of selected option ids
  | { type: "open"; answer: boolean } // Whether answer was revealed
  | { type: "matching"; answer: { [key: string]: string } }; // left item -> selected right option

// LocalStorage structure
export interface UserAnswersStorage {
  [questionId: number]: UserAnswer;
}
