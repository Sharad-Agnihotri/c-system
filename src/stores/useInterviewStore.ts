import { create } from "zustand";
import type { InterviewRound, UserAnswer, InterviewResult } from "@/types/interview";
import { delay } from "@/lib/utils";

interface InterviewState {
  currentRound: InterviewRound | null;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  result: InterviewResult | null;
  isLoading: boolean;
  completedRounds: InterviewRound[];
  setRound: (round: InterviewRound) => void;
  submitAnswer: (answer: UserAnswer) => void;
  nextQuestion: () => void;
  finishRound: () => Promise<void>;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>()((set, get) => ({
  currentRound: null,
  currentQuestionIndex: 0,
  answers: [],
  result: null,
  isLoading: false,
  completedRounds: [],

  setRound: (round) =>
    set({ currentRound: round, currentQuestionIndex: 0, answers: [] }),

  submitAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),

  nextQuestion: () =>
    set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),

  finishRound: async () => {
    const { currentRound, completedRounds } = get();
    set({ isLoading: true });
    await delay(2000);

    if (currentRound && !completedRounds.includes(currentRound)) {
      set((state) => ({
        completedRounds: [...state.completedRounds, currentRound],
        isLoading: false,
        currentRound: null,
        currentQuestionIndex: 0,
      }));
    }

    // If all rounds completed, generate result
    const updatedRounds = get().completedRounds;
    if (updatedRounds.length === 4) {
      set({
        result: {
          overallScore: 74,
          rounds: [
            { round: "aptitude", score: 16, total: 20, percentage: 80, feedback: "Strong analytical skills", strengths: ["Pattern recognition", "Quick calculation"], weaknesses: ["Time management on complex problems"] },
            { round: "coding", score: 2, total: 3, percentage: 67, feedback: "Good problem-solving approach", strengths: ["Clean code", "Optimal solutions"], weaknesses: ["Edge case handling"] },
            { round: "technical", score: 7, total: 10, percentage: 70, feedback: "Solid fundamentals", strengths: ["Data structures", "API design"], weaknesses: ["System design depth"] },
            { round: "hr", score: 7, total: 8, percentage: 88, feedback: "Excellent communication", strengths: ["Clear articulation", "Positive attitude"], weaknesses: ["Could provide more specific examples"] },
          ],
          strengths: ["Analytical thinking", "Clean coding", "Communication"],
          weaknesses: ["System design", "Edge case coverage"],
          suggestions: ["Practice system design problems", "Focus on time-boxed problem solving"],
          completedAt: new Date().toISOString(),
        },
      });
    }
  },

  reset: () =>
    set({
      currentRound: null,
      currentQuestionIndex: 0,
      answers: [],
      result: null,
      isLoading: false,
      completedRounds: [],
    }),
}));
