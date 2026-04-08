"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/stores/useInterviewStore";
import PageHeader from "@/components/shared/PageHeader";
import {
  Brain,
  Clock,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface AptitudeQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  topic: string;
}

const fallbackQuestions: AptitudeQuestion[] = [
  { id: 1, topic: "Quantitative", question: "A train 120m long passes a platform 80m long in 20 seconds. What is the speed of the train?", options: ["36 km/h", "10 m/s", "40 km/h", "8 m/s"], correct: 1 },
  { id: 2, topic: "Logical Reasoning", question: "If all Bloops are Razzles and all Razzles are Lazzles, then which statement must be true?", options: ["All Lazzles are Bloops", "All Bloops are Lazzles", "Some Lazzles are not Bloops", "No Razzles are Bloops"], correct: 1 },
  { id: 3, topic: "Quantitative", question: "What is the next number in the series: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "36"], correct: 1 },
  { id: 4, topic: "Pattern Recognition", question: "If COMPUTER is coded as RFUVQNPC, then PRINTER is coded as?", options: ["QSJOUFS", "SFUOJSQ", "OSJUFSQ", "QSJOUFR"], correct: 0 },
  { id: 5, topic: "Quantitative", question: "A shopkeeper sells an item at 20% profit. If the cost price is ₹500, what is the selling price?", options: ["₹550", "₹600", "₹650", "₹580"], correct: 1 },
  { id: 6, topic: "Logical Reasoning", question: "In a race of 100m, A beats B by 10m and B beats C by 20m. By how much does A beat C?", options: ["28m", "30m", "32m", "25m"], correct: 0 },
  { id: 7, topic: "Pattern Recognition", question: "Complete the series: 1, 1, 2, 3, 5, 8, 13, ?", options: ["18", "20", "21", "16"], correct: 2 },
  { id: 8, topic: "Quantitative", question: "Two pipes A and B can fill a tank in 12 and 15 minutes. If both are opened, how many minutes to fill?", options: ["6 min", "6.67 min", "7 min", "8 min"], correct: 1 },
  { id: 9, topic: "Logical Reasoning", question: "Looking at a photograph, Arun says 'She is the daughter of my grandfather's only son.' How is she related?", options: ["Mother", "Sister", "Cousin", "Daughter"], correct: 1 },
  { id: 10, topic: "Quantitative", question: "What is the probability of getting at least one head when tossing two fair coins?", options: ["1/4", "1/2", "3/4", "1"], correct: 2 },
];

export default function AptitudePage() {
  const router = useRouter();
  const { finishRound } = useInterviewStore();
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions on mount
  const fetchQuestions = async () => {
    setIsGenerating(true);
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    try {
      const res = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ round: "aptitude" }),
      });
      const data = await res.json();
      if (data.questions?.length > 0) {
        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(null));
      } else {
        setQuestions(fallbackQuestions);
        setAnswers(Array(fallbackQuestions.length).fill(null));
      }
    } catch {
      setQuestions(fallbackQuestions);
      setAnswers(Array(fallbackQuestions.length).fill(null));
    }
    setTimeLeft(30 * 60);
    setIsGenerating(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  // Timer
  useEffect(() => {
    if (showResult || isGenerating || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleSubmitAll(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult, isGenerating, questions.length]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSelect = (optionIndex: number) => {
    setSelected(optionIndex);
    const copy = [...answers];
    copy[currentQ] = optionIndex;
    setAnswers(copy);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(answers[currentQ + 1]);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelected(answers[currentQ - 1]);
    }
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    setShowResult(true);
    await finishRound();
    setIsSubmitting(false);
  };

  // Loading state
  if (isGenerating) {
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader title="Aptitude Round" />
        <div className="card p-12 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-muted)] flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-7 h-7 text-[var(--color-accent)] animate-pulse" />
          </div>
          <h3 className="text-lg font-heading font-semibold mb-2">Generating Questions...</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            AI is creating unique questions for your session
          </p>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const score = answers.filter((a, i) => a === questions[i].correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <PageHeader title="Aptitude Round — Results" />
        <div className="card p-8 text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none"
                stroke={percentage >= 70 ? "var(--color-success)" : percentage >= 50 ? "var(--color-accent)" : "var(--color-danger)"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 327} 327`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold">{score}</span>
              <span className="text-xs text-[var(--color-text-muted)]">/ {questions.length}</span>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            You scored {percentage}% in the aptitude round
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correct;
            return (
              <div key={q.id} className={`card p-4 border-l-4 ${isCorrect ? "border-l-[var(--color-success)]" : "border-l-[var(--color-danger)]"}`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Q{i + 1}. {q.question}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Your answer: <span className={isCorrect ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}>{userAnswer !== null ? q.options[userAnswer] : "Not answered"}</span>
                      {!isCorrect && <> · Correct: <span className="text-[var(--color-success)]">{q.options[q.correct]}</span></>}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={fetchQuestions} className="btn-secondary flex-1">
            <RefreshCw className="w-4 h-4" /> New Questions
          </button>
          <button onClick={() => router.push("/interview")} className="btn-primary flex-1">
            <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Aptitude Round" />

      {/* Timer + Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Brain className="w-4 h-4 text-[var(--color-accent)]" />
          Question {currentQ + 1} of {questions.length}
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-mono font-medium ${timeLeft < 300 ? "text-[var(--color-danger)]" : "text-[var(--color-text-secondary)]"}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full cursor-pointer transition-all"
            style={{
              backgroundColor:
                i === currentQ ? "var(--color-accent)" :
                answers[i] !== null ? "var(--color-success)" :
                "var(--color-border)",
            }}
            onClick={() => { setCurrentQ(i); setSelected(answers[i]); }}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="card p-8 mb-6 animate-fade-in" key={`q-${currentQ}`}>
        <span className="badge badge-accent mb-3">{q.topic}</span>
        <h2 className="text-base font-heading font-semibold mb-6 leading-relaxed">
          {q.question}
        </h2>

        <div className="space-y-3">
          {q.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-lg border text-sm font-medium transition-all ${
                selected === idx
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]"
              }`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border mr-3 text-xs"
                style={{
                  borderColor: selected === idx ? "var(--color-accent)" : "var(--color-border)",
                  backgroundColor: selected === idx ? "var(--color-accent)" : "transparent",
                  color: selected === idx ? "#000" : "var(--color-text-muted)",
                }}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={handlePrev} disabled={currentQ === 0} className="btn-secondary text-sm">
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <div className="flex gap-3">
          {currentQ === questions.length - 1 ? (
            <button onClick={handleSubmitAll} className="btn-primary text-sm animate-pulse-glow">
              Submit All
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary text-sm">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
