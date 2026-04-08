export type InterviewRound = "aptitude" | "coding" | "technical" | "hr";

export interface Question {
  id: string;
  round: InterviewRound;
  text: string;
  options?: string[];
  correctAnswer?: string | number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  timeLimit: number; // seconds
}

export interface CodingProblem extends Question {
  starterCode: string;
  language: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  constraints: string[];
}

export interface UserAnswer {
  questionId: string;
  answer: string | number;
  timeSpent: number;
  isCorrect?: boolean;
}

export interface RoundScore {
  round: InterviewRound;
  score: number;
  total: number;
  percentage: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
}

export interface InterviewResult {
  overallScore: number;
  rounds: RoundScore[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  completedAt: string;
}

export interface InterviewState {
  currentRound: InterviewRound | null;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  result: InterviewResult | null;
  isLoading: boolean;
  timeRemaining: number;
  setRound: (round: InterviewRound) => void;
  submitAnswer: (answer: UserAnswer) => void;
  finishRound: () => Promise<void>;
  reset: () => void;
}
