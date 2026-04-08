"use client";

import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/stores/useInterviewStore";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { getScoreColor, getScoreLabel } from "@/lib/utils";
import {
  Trophy,
  ArrowLeft,
  Brain,
  Code2,
  Cpu,
  Users,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const roundIcons: Record<string, React.ReactNode> = {
  aptitude: <Brain className="w-5 h-5" />,
  coding: <Code2 className="w-5 h-5" />,
  technical: <Cpu className="w-5 h-5" />,
  hr: <Users className="w-5 h-5" />,
};

const roundLabels: Record<string, string> = {
  aptitude: "Aptitude",
  coding: "Coding",
  technical: "Technical",
  hr: "HR",
};

export default function ResultsPage() {
  const router = useRouter();
  const { result, reset } = useInterviewStore();

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader title="Interview Results" />
        <EmptyState
          title="No results yet"
          description="Complete all 4 interview rounds to see your comprehensive results"
          action={
            <button onClick={() => router.push("/interview")} className="btn-primary text-sm">
              <ArrowLeft className="w-4 h-4" /> Go to Interview Prep
            </button>
          }
          icon={<Trophy className="w-7 h-7 text-[var(--color-text-muted)]" />}
        />
      </div>
    );
  }

  const radarData = result.rounds.map((r) => ({
    round: roundLabels[r.round],
    score: r.percentage,
    fullMark: 100,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Interview Results"
        description={`Completed on ${new Date(result.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
        action={
          <button onClick={() => { reset(); router.push("/interview"); }} className="btn-secondary text-sm">
            <RefreshCw className="w-4 h-4" /> Retake Interview
          </button>
        }
      />

      {/* Overall Score */}
      <div className="card p-8 text-center mb-6 animate-fade-in">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={getScoreColor(result.overallScore)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(result.overallScore / 100) * 327} 327`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-heading font-bold" style={{ color: getScoreColor(result.overallScore) }}>
              {result.overallScore}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">/ 100</span>
          </div>
        </div>
        <h2 className="text-lg font-heading font-semibold mb-1">Overall Interview Score</h2>
        <span className="badge badge-accent">{getScoreLabel(result.overallScore)}</span>
      </div>

      {/* Radar + Round Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Radar Chart */}
        <div className="card p-8 animate-fade-in stagger-1">
          <h3 className="text-sm font-heading font-semibold mb-4">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="round" tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="var(--color-accent)"
                fill="var(--color-accent)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Round cards */}
        <div className="space-y-3 animate-fade-in stagger-2">
          {result.rounds.map((r) => (
            <div key={r.round} className="card p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: getScoreColor(r.percentage) + "15", color: getScoreColor(r.percentage) }}
                >
                  {roundIcons[r.round]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{roundLabels[r.round]}</h4>
                    <span className="text-sm font-heading font-bold" style={{ color: getScoreColor(r.percentage) }}>
                      {r.percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {r.score} / {r.total} · {r.feedback}
                  </p>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${r.percentage}%`, backgroundColor: getScoreColor(r.percentage) }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-8 animate-fade-in stagger-3">
          <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[var(--color-success)]" /> Strengths
          </h3>
          <ul className="space-y-2.5">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--color-text-secondary)]">{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-8 animate-fade-in stagger-4">
          <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-[var(--color-danger)]" /> Areas to Improve
          </h3>
          <ul className="space-y-2.5">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <AlertCircle className="w-4 h-4 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--color-text-secondary)]">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card p-8 animate-fade-in stagger-5">
        <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-[var(--color-accent)]" /> Improvement Suggestions
        </h3>
        <div className="space-y-3">
          {result.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
              <span className="w-5 h-5 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-[var(--color-text-secondary)]">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
