"use client";

import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import { useInterviewStore } from "@/stores/useInterviewStore";
import {
  Brain,
  Code2,
  Cpu,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Trophy,
  BarChart3,
} from "lucide-react";

const rounds = [
  {
    id: "aptitude",
    label: "Aptitude Round",
    icon: Brain,
    description: "Test your quantitative ability, logical reasoning, and pattern recognition skills",
    duration: "30 min",
    questions: 20,
    color: "var(--color-accent)",
    href: "/interview/aptitude",
    topics: ["Quantitative", "Logical Reasoning", "Pattern Recognition"],
  },
  {
    id: "coding",
    label: "Coding Round",
    icon: Code2,
    description: "Solve DSA problems with a built-in code editor and test case validation",
    duration: "60 min",
    questions: 3,
    color: "var(--color-info)",
    href: "/interview/coding",
    topics: ["Arrays", "Linked Lists", "Trees", "Dynamic Programming"],
  },
  {
    id: "technical",
    label: "Technical Round",
    icon: Cpu,
    description: "Deep dive into CS fundamentals, system design, and architecture concepts",
    duration: "45 min",
    questions: 10,
    color: "var(--color-success)",
    href: "/interview/technical",
    topics: ["DSA", "System Design", "OS", "DBMS", "Networking"],
  },
  {
    id: "HR Round",
    label: "HR Round",
    icon: Users,
    description: "Practice behavioral and situational interview questions with AI feedback",
    duration: "20 min",
    questions: 8,
    color: "var(--color-warning)",
    href: "/interview/hr",
    topics: ["Behavioral", "Situational", "Culture Fit"],
  },
];

export default function InterviewPage() {
  const { completedRounds, result } = useInterviewStore();

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Interview Preparation"
        description="Practice across 4 rounds and get AI-powered scoring and feedback"
        action={
          result ? (
            <Link href="/interview/results" className="btn-primary text-sm">
              <Trophy className="w-4 h-4" />
              View Results
            </Link>
          ) : null
        }
      />

      {/* Progress */}
      <div className="card p-8 mb-12 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-heading font-semibold">Your Progress</h3>
          <span className="text-xs text-[var(--color-text-muted)]">
            {completedRounds.length} of 4 rounds completed
          </span>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i < completedRounds.length
                  ? "var(--color-accent)"
                  : "var(--color-border)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Round Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rounds.map((round, i) => {
          const Icon = round.icon;
          const isCompleted = completedRounds.includes(round.id as "aptitude" | "coding" | "technical" | "hr");

          return (
            <Link
              key={round.id}
              href={round.href}
              className={`card p-8 group cursor-pointer animate-fade-in stagger-${i + 1} ${
                isCompleted ? "border-[var(--color-success)]/30" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: round.color + "15",
                    color: round.color,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                {isCompleted ? (
                  <div className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </div>
                ) : (
                  <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                )}
              </div>

              <h3 className="font-heading font-semibold text-base mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                {round.label}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5">
                {round.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-6 text-xs text-[var(--color-text-secondary)] mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {round.duration}
                </span>
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> {round.questions} questions
                </span>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {round.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="card p-8 mt-8 animate-fade-in stagger-5">
        <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-[var(--color-accent)]" />
          Interview Tips
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Practice coding problems daily — consistency beats cramming",
            "For system design, always discuss trade-offs",
            "Use the STAR method for behavioral questions",
            "Time yourself during aptitude rounds",
          ].map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]"
            >
              <span className="w-5 h-5 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-[var(--color-text-secondary)]">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
