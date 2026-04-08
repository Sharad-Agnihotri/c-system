"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/stores/useInterviewStore";
import PageHeader from "@/components/shared/PageHeader";
import {
  Cpu,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Send,
  Lightbulb,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface TechQuestion {
  id: number;
  category: string;
  question: string;
  hint: string;
  sampleAnswer: string;
}

const fallbackQuestions: TechQuestion[] = [
  { id: 1, category: "Data Structures", question: "Explain the difference between a stack and a queue. Provide real-world examples of each.", hint: "Think about LIFO vs FIFO ordering", sampleAnswer: "A stack follows LIFO (Last In First Out) — like a stack of plates. A queue follows FIFO (First In First Out) — like a line at a store." },
  { id: 2, category: "Algorithms", question: "What is the time complexity of binary search? Why is it more efficient than linear search?", hint: "Consider how the search space is divided at each step", sampleAnswer: "Binary search has O(log n) complexity as it halves the search space each step, vs O(n) for linear search." },
  { id: 3, category: "System Design", question: "How would you design a URL shortener like bit.ly? Discuss the key components.", hint: "Think about hash generation, storage, and redirection", sampleAnswer: "Key components: hash function for short URL generation, database for mapping, caching layer, and redirect service." },
  { id: 4, category: "Operating Systems", question: "What is the difference between a process and a thread? When would you use multithreading?", hint: "Consider memory sharing and context switching costs", sampleAnswer: "A process has its own memory space; threads share memory within a process. Use multithreading for I/O-bound tasks." },
  { id: 5, category: "DBMS", question: "Explain the ACID properties in database transactions. Why are they important?", hint: "Atomicity, Consistency, Isolation, Durability", sampleAnswer: "ACID ensures reliable transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (persistence)." },
  { id: 6, category: "Networking", question: "What happens when you type a URL into a browser and press Enter?", hint: "DNS → TCP → HTTP → Rendering", sampleAnswer: "DNS resolution → TCP handshake → TLS (if HTTPS) → HTTP request → Server processing → Response → Browser rendering." },
  { id: 7, category: "Data Structures", question: "Explain how a hash map works internally. How are collisions handled?", hint: "Think about hashing, buckets, and collision resolution strategies", sampleAnswer: "A hash map uses a hash function to map keys to bucket indices. Collisions are handled via chaining (linked lists) or open addressing." },
  { id: 8, category: "System Design", question: "Design a chat application. What protocols and architecture would you choose?", hint: "Consider WebSockets, message queues, and database choices", sampleAnswer: "WebSocket for real-time bidirectional communication, message queue for reliability, NoSQL for message storage, presence service for online status." },
];

export default function TechnicalPage() {
  const router = useRouter();
  const { finishRound } = useInterviewStore();
  const [questions, setQuestions] = useState<TechQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const fetchQuestions = async () => {
    setIsGenerating(true);
    setCurrentQ(0);
    setShowResult(false);
    setShowHint(false);
    try {
      const res = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ round: "technical" }),
      });
      const data = await res.json();
      if (data.questions?.length > 0) {
        setQuestions(data.questions);
        setUserAnswers(Array(data.questions.length).fill(""));
      } else {
        setQuestions(fallbackQuestions);
        setUserAnswers(Array(fallbackQuestions.length).fill(""));
      }
    } catch {
      setQuestions(fallbackQuestions);
      setUserAnswers(Array(fallbackQuestions.length).fill(""));
    }
    setIsGenerating(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleSubmit = async () => {
    setShowResult(true);
    await finishRound();
  };

  // Loading state
  if (isGenerating) {
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader title="Technical Round" />
        <div className="card p-12 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-7 h-7 text-[var(--color-success)] animate-pulse" />
          </div>
          <h3 className="text-lg font-heading font-semibold mb-2">Generating Questions...</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            AI is crafting unique technical questions for you
          </p>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[currentQ];

  if (showResult) {
    const answeredCount = userAnswers.filter((a) => a.trim().length > 20).length;
    const score = Math.round((answeredCount / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <PageHeader title="Technical Round — Results" />
        <div className="card p-8 text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={score >= 70 ? "var(--color-success)" : "var(--color-accent)"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score / 100) * 327} 327`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold">{answeredCount}</span>
              <span className="text-xs text-[var(--color-text-muted)]">/ {questions.length}</span>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">Technical round score: {score}%</p>
        </div>

        <div className="space-y-3 mb-6">
          {questions.map((q, i) => {
            const answered = userAnswers[i].trim().length > 20;
            return (
              <div key={q.id} className="card p-4">
                <p className="text-sm font-medium mb-2">{q.question}</p>
                <div className="p-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] mb-2">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {userAnswers[i] || "No answer provided"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-success-muted)] border border-[var(--color-success)]/20">
                  <p className="text-xs font-medium text-[var(--color-success)] mb-1">Sample Answer</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{q.sampleAnswer}</p>
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

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Technical Round" />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[var(--color-text-muted)]">
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className="badge text-xs" style={{
          backgroundColor: q.category === "System Design" ? "var(--color-accent-muted)" : "var(--color-bg-elevated)",
          color: q.category === "System Design" ? "var(--color-accent)" : "var(--color-text-secondary)",
        }}>
          {q.category}
        </span>
      </div>

      <div className="flex gap-1 mb-6">
        {questions.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all" style={{
            backgroundColor: i === currentQ ? "var(--color-accent)" : userAnswers[i]?.trim() ? "var(--color-success)" : "var(--color-border)",
          }} />
        ))}
      </div>

      <div className="card p-8 mb-4 animate-fade-in" key={`tech-${currentQ}`}>
        <div className="flex items-start gap-3 mb-4">
          <Cpu className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
          <h2 className="text-base font-heading font-semibold leading-relaxed">{q.question}</h2>
        </div>

        {showHint && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 animate-fade-in">
            <p className="text-xs text-[var(--color-accent)] flex items-center gap-1.5">
              <Lightbulb className="w-3 h-3" />
              Hint: {q.hint}
            </p>
          </div>
        )}

        <textarea
          className="input min-h-[180px] resize-y font-mono text-sm"
          placeholder="Type your answer here..."
          value={userAnswers[currentQ]}
          onChange={(e) => {
            const copy = [...userAnswers];
            copy[currentQ] = e.target.value;
            setUserAnswers(copy);
          }}
        />

        <button onClick={() => setShowHint(!showHint)} className="btn-ghost text-xs text-[var(--color-accent)] mt-2">
          <Lightbulb className="w-3 h-3" />
          {showHint ? "Hide hint" : "Show hint"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => { setCurrentQ(Math.max(0, currentQ - 1)); setShowHint(false); }} disabled={currentQ === 0} className="btn-secondary text-sm">
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        {currentQ === questions.length - 1 ? (
          <button onClick={handleSubmit} className="btn-primary text-sm animate-pulse-glow">
            Submit All <Send className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => { setCurrentQ(currentQ + 1); setShowHint(false); }} className="btn-primary text-sm">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
